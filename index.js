// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();


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

app.use('/api/uploads', express.static('uploads'));

// Use the npkunta downloads routes
const npkuntadownloadsRouter = require("./routes/npkuntadownloadroutes");
const npkuntainformationsRouter = require("./routes/npkuntainformationroutes");
const npkuntalanddetailRouter = require("./routes/npkuntalanddetailroutes");

app.use("/api", npkuntadownloadsRouter);
app.use("/api", npkuntainformationsRouter);
app.use("/api", npkuntalanddetailRouter);



const kurnooldownloadsRouter = require("./routes/kurnooldownloadroutes");
const kurnoolinformationsRouter = require("./routes/kurnoolinformationroutes");
const kurnoollanddetailRouter = require("./routes/kurnoollanddetailroutes");


app.use("/api", kurnooldownloadsRouter);
app.use("/api", kurnoolinformationsRouter);
app.use("/api", kurnoollanddetailRouter);


const gaaliveedudownloadsRouter = require("./routes/gaaliveedudownloadroutes");
const gaaliveeduinformationsRouter = require("./routes/gaaliveeduinformationroutes");
const gaaliveedulanddetailRouter = require("./routes/gaaliveedulanddetailroutes");


app.use("/api", gaaliveedudownloadsRouter);
app.use("/api", gaaliveeduinformationsRouter);
app.use("/api", gaaliveedulanddetailRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});