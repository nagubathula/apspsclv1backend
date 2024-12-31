const mongoose = require("mongoose");

// Downloads Schema
const gaaliveedudownloadsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  path: { type: String, required: true },
});

// Information Schema
const gaaliveeduinformationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  path: { type: String, required: true },
});

// Land Details Schema
const gaaliveedulanddetailsSchema = new mongoose.Schema({
  villagename: { type: String, required: true, trim: true },
  govtland: { type: Number, required: true, default: 0 },
  assignedland: { type: Number, required: true, default: 0 },
  pattaland: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
});

// Models
const GaaliveeduDownloads = mongoose.model(
  "GaaliveeduDownloads",
  gaaliveedudownloadsSchema
);
const GaaliveeduInformation = mongoose.model(
  "GaaliveeduInformation",
  gaaliveeduinformationSchema
);
const GaaliveeduLandDetails = mongoose.model(
  "GaaliveeduLandDetails",
  gaaliveedulanddetailsSchema
);

module.exports = { GaaliveeduDownloads, GaaliveeduInformation, GaaliveeduLandDetails };
