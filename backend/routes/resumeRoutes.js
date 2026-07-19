const express = require("express");
const upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadAndAnalyze, getHistory } = require("../controllers/resumeController");

const router = express.Router();

const handleUpload = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.post("/upload", authMiddleware, handleUpload, uploadAndAnalyze);
router.get("/history", authMiddleware, getHistory);

module.exports = router;
