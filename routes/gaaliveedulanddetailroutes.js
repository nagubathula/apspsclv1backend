const express = require("express");
const router = express.Router();
const { GaaliveeduLandDetails } = require("../models/gaaliveeduSchema");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/gaaliveedu");
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
    const { villagename, govtland, assignedland, pattaland, total } = req.body;
    const relativePath = req.file ? `uploads/gaaliveedu/${req.file.filename}` : "";

    const landdetail = new GaaliveeduLandDetails({
      villagename,
      govtland,
      assignedland,
      pattaland,
      total,
      path: relativePath,
    });

    await landdetail.save();
    res.status(201).json(landdetail);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file" });
  }
};

// Get All LandDetails
const getLandDetails = async (req, res) => {
  try {
    const landdetails = await GaaliveeduLandDetails.find();
    res.status(200).json(landdetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Download by ID
const deleteDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const landdetail = await GaaliveeduLandDetails.findByIdAndDelete(id);

    if (!landdetail) {
      return res.status(404).json({ error: "Download not found." });
    }

    const filePath = path.join(__dirname, "..", landdetail.path);
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
    const { villagename, govtland, assignedland, pattaland, total } = req.body;
    const landdetail = await GaaliveeduLandDetails.findById(id);

    if (!landdetail) {
      return res.status(404).json({ error: "Download not found." });
    }

    let relativePath = landdetail.path;
    if (req.file) {
      const oldFilePath = path.join(__dirname, "..", landdetail.path);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log("Old file deleted successfully");
      }
      relativePath = `uploads/gaaliveedu/${req.file.filename}`;
    }

    landdetail.villagename = villagename;
    landdetail.govtland = govtland;
    landdetail.assignedland = assignedland;
    landdetail.pattaland = pattaland;
    landdetail.total = total;
    landdetail.path = relativePath;

    await landdetail.save();

    res.status(200).json(landdetail);
  } catch (error) {
    console.error("Error during file update:", error);
    res.status(500).json({ error: "Failed to update landdetail" });
  }
};

// API Routes
router.post("/gaaliveedulanddetails/upload", upload.single("file"), uploadFile);
router.get("/gaaliveedulanddetails/landdetails", getLandDetails);
router.delete("/gaaliveedulanddetails/landdetails/:id", deleteDownload);
router.put(
  "/gaaliveedulanddetails/landdetails/:id",
  upload.single("file"),
  updateDownload
);

module.exports = router;
