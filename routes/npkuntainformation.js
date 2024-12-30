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

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed."));
    }
  },
});

// File Upload Controller
const uploadFile = async (req, res) => {
  try {
    const { title } = req.body;
    const relativePath = `uploads/npkunta/${req.file.filename}`; // Store relative path

    const download = new NpkuntaDownloads({
      title,
      path: relativePath, // Save this in DB
    });

    await download.save();
    res.status(201).json(download);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file" });
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

    const filePath = path.join(__dirname, "..", download.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted successfully");
    } else {
      console.log("File not found, skipping deletion");
    }

    res.status(200).json({ message: "Download deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Download (PUT)
const updateDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const download = await NpkuntaDownloads.findById(id);

    if (!download) {
      return res.status(404).json({ error: "Download not found." });
    }

    // If a new file is uploaded, delete the old file and update the path
    let relativePath = download.path; // Keep the old path initially
    if (req.file) {
      // Get the absolute path of the old file
      const oldFilePath = path.join(__dirname, "..", download.path);
      console.log("Old file path:", oldFilePath);

      // Check if the file exists before attempting to unlink
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log("Old file deleted successfully");
      } else {
        console.log("Old file does not exist, skipping deletion");
      }

      // Set the new file's relative path
      relativePath = `uploads/npkunta/${req.file.filename}`;
    }

    // Update the download information
    download.title = title;
    download.path = relativePath; // Update path if a new file is uploaded

    // Save the updated information
    await download.save();

    res.status(200).json(download); // Respond with the updated download object
  } catch (error) {
    console.error("Error during file update:", error);
    res.status(500).json({ error: "Failed to update download" });
  }
};

// API Routes
router.post("/npkuntadownloads/upload", upload.single("file"), uploadFile);
router.get("/npkuntadownloads/downloads", getDownloads);
router.delete("/npkuntadownloads/downloads/:id", deleteDownload);
router.put(
  "/npkuntadownloads/downloads/:id",
  upload.single("file"),
  updateDownload
);

module.exports = router;
