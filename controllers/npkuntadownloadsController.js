// controllers/npkuntaDownloadsController.js
const express = require("express");
const router = express.Router();
const { NpkuntaDownloads } = require("../models/npkuntaSchema");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/npkunta");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// File Upload Controller
const uploadFile = async (req, res) => {
  try {
      const { title } = req.body;
      const filePath = `/uploads/npkunta/${req.file.filename}`;  // Use relative path

      const download = new NpkuntaDownloads({
          title,
          path: filePath  // Save relative path in DB
      });

      await download.save();
      res.status(201).json(download);
  } catch (error) {
      res.status(500).json({ error: 'Failed to upload file' });
  }
};


// Get All Downloads
const getDownloads = async (req, res) => {
  try {
    const downloads = await NpkuntaDownloads.find();
    res.status(200).json(downloads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Download by ID
const deleteDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const download = await NpkuntaDownloads.findByIdAndDelete(id);
    
    if (!download) {
      return res.status(404).json({ error: "Download not found." });
    }

    // Remove file from filesystem
    fs.unlinkSync(download.path);
    res.status(200).json({ message: "Download deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// API Routes
router.post("/npkuntadownloads/upload", upload.single("file"), uploadFile);
router.get("/npkuntadownloads/downloads", getDownloads);
router.delete("/npkuntadownloads/downloads/:id", deleteDownload);

module.exports = router;
