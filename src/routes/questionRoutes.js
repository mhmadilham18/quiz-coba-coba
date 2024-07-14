const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

// Endpoint untuk mendapatkan 20 pertanyaan acak
router.get("/random", questionController.getRandomQuestions);

// Endpoint untuk mengirimkan jawaban pengguna
router.post("/submit", questionController.submitAnswers);

module.exports = router;
