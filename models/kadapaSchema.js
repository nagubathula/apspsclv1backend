const mongoose = require("mongoose");

// Downloads Schema
const kadapadownloadsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  path: { type: String, required: true },
});

// Information Schema
const kadapainformationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  path: { type: String, required: true },
});

// Land Details Schema
const kadapalanddetailsSchema = new mongoose.Schema({
  villagename: { type: String, required: true, trim: true },
  govtland: { type: Number, required: true, default: 0 },
  assignedland: { type: Number, required: true, default: 0 },
  pattaland: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
});

// Models
const KadapaDownloads = mongoose.model(
  "KadapaDownloads",
  kadapadownloadsSchema
);
const KadapaInformation = mongoose.model(
  "KadapaInformation",
  kadapainformationSchema
);
const KadapaLandDetails = mongoose.model(
  "KadapaLandDetails",
  kadapalanddetailsSchema
);

module.exports = { KadapaDownloads, KadapaInformation, KadapaLandDetails };
