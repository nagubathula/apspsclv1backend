const express = require("express");
const router = express.Router();
const { NpkuntaInformation } = require("../models/npkuntaSchema");
const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/npkunta");
    await fs.mkdir(uploadPath, { recursive: true });
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
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Invalid file type. Only PDF, JPEG, and PNG allowed."));
  },
});

// Upload Controller
const uploadFile = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description required" });
    }

    const relativePath = `uploads/npkunta/${req.file.filename}`;
    const information = new NpkuntaInformation({ title, description, path: relativePath });
    await information.save();

    res.status(201).json(information);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file" });
  }
};

// Get All Files with Pagination
const getInformations = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const informations = await NpkuntaInformation.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(informations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// File Deletion
const deleteInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const information = await NpkuntaInformation.findByIdAndDelete(id);

    if (!information) return res.status(404).json({ error: "File not found" });

    const filePath = path.join(__dirname, "..", information.path);
    await fs.unlink(filePath).catch(() => null);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update File and Metadata
const updateInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const information = await NpkuntaInformation.findById(id);

    if (!information) return res.status(404).json({ error: "File not found" });

    if (req.file) {
      const oldFilePath = path.join(__dirname, "..", information.path);
      await fs.unlink(oldFilePath).catch(() => null);

      information.path = `uploads/npkunta/${req.file.filename}`;
    }

    information.title = title;
    information.description = description;
    await information.save();

    res.status(200).json(information);
  } catch (error) {
    res.status(500).json({ error: "Failed to update file" });
  }
};

// API Routes
router.post("/npkuntainformations/upload", upload.single("file"), uploadFile);
router.get("/npkuntainformations/informations", getInformations);
router.delete("/npkuntainformations/informations/:id", deleteInformation);
router.put("/npkuntainformations/informations/:id", upload.single("file"), updateInformation);

module.exports = router;
