const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const questionController = require("../controllers/questionController");
const adminController = require("../controllers/adminController");

// Endpoint untuk login admin
router.post("/login", adminController.login);

// Endpoint untuk upload dataset soal
router.post("/upload", authMiddleware, questionController.uploadDataset);

// Endpoint untuk menghapus dataset soal
router.delete("/delete", authMiddleware, questionController.deleteDataset);

// Endpoint untuk mengunduh hasil ujian
router.get("/download", authMiddleware, questionController.downloadResults);

module.exports = router;
