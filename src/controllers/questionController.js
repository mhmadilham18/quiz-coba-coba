const Question = require("../models/Question");
const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { parse } = require("json2csv");

// Fungsi untuk mendapatkan 20 pertanyaan acak
exports.getRandomQuestions = async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 20 } }]);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Gagal mendapatkan pertanyaan" });
  }
};

// Fungsi untuk mengirimkan jawaban pengguna
exports.submitAnswers = async (req, res) => {
  const { userAnswers } = req.body;

  try {
    let correctCount = 0;
    let incorrectCount = 0;

    for (const userAnswer of userAnswers) {
      const question = await Question.findById(userAnswer.questionId);

      if (question.correctAnswer === userAnswer.answer) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      // Update statistik soal
      question.appearanceCount = question.appearanceCount
        ? question.appearanceCount + 1
        : 1;
      if (userAnswer.answer === question.correctAnswer) {
        question.correctCount = question.correctCount
          ? question.correctCount + 1
          : 1;
      } else {
        question.incorrectCount = question.incorrectCount
          ? question.incorrectCount + 1
          : 1;
      }

      await question.save();
    }

    res.json({ correctCount, incorrectCount });
  } catch (err) {
    res.status(500).json({ message: "Gagal menyimpan jawaban" });
  }
};

// Fungsi untuk upload dataset soal
exports.uploadDataset = (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        await Question.deleteMany({});
        await Question.insertMany(results);
        res.status(200).json({ message: "Dataset berhasil diupload" });
      } catch (err) {
        res.status(500).json({ message: "Gagal upload dataset" });
      }
    });
};

// Fungsi untuk menghapus dataset soal
exports.deleteDataset = async (req, res) => {
  try {
    await Question.deleteMany({});
    res.status(200).json({ message: "Dataset berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus dataset" });
  }
};

// Fungsi untuk mengunduh hasil ujian
exports.downloadResults = async (req, res) => {
  try {
    const questions = await Question.find({});
    const fields = [
      "question",
      "options",
      "correctAnswer",
      "appearanceCount",
      "correctCount",
      "incorrectCount",
    ];
    const opts = { fields };
    const csv = parse(questions, opts);
    res.attachment("results.csv");
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengunduh hasil ujian" });
  }
};
