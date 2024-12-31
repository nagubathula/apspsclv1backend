
const gaaliveedudownloadsRouter = require("./routes/gaaliveedudownloadroutes");
const gaaliveeduinformationsRouter = require("./routes/gaaliveeduinformationroutes");
const gaaliveedulanddetailRouter = require("./routes/gaaliveedulanddetailroutes");


app.use("/api", gaaliveedudownloadsRouter);
app.use("/api", gaaliveeduinformationsRouter);
app.use("/api", gaaliveedulanddetailRouter);

