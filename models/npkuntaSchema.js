const mongoose = require("mongoose");

// Downloads Schema
const npkuntadownloadsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  path: { type: String, required: true },
});

// Information Schema
const npkuntainformationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  path: { type: String, required: true },
});

// Land Details Schema
const npkuntalanddetailsSchema = new mongoose.Schema({
  villagename: { type: String, required: true, trim: true },
  govtland: { type: Number, required: true, default: 0 },
  assignedland: { type: Number, required: true, default: 0 },
  pattaland: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
});

// Models
const NpkuntaDownloads = mongoose.model(
  "NpkuntaDownloads",
  npkuntadownloadsSchema
);
const NpkuntaInformation = mongoose.model(
  "NpkuntaInformation",
  npkuntainformationSchema
);
const NpkuntaLandDetails = mongoose.model(
  "NpkuntaLandDetails",
  npkuntalanddetailsSchema
);

module.exports = { NpkuntaDownloads, NpkuntaInformation, NpkuntaLandDetails };
