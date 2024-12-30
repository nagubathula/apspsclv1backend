// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();

const npkuntadownloadsRouter = require("./routes/npkuntadownloadroutes");
require("dotenv").config();
app.use(cors())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware to handle JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the npkunta downloads routes
app.use('/uploads', express.static('uploads'));
app.use("/api", npkuntadownloadsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});