const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Joi = require("joi");
const { json } = require("express");
const tsAdmin = require("./routes/tsAdmin");
const validateEmail = require("./routes/validateEmail");
const Invite = require("./routes/Invite");
const auth = require("./routes/auth");

mongoose
  .connect(
    "mongodb+srv://tsMongoDB:G00d2Gr8!@cartly-snlgr.mongodb.net/Cartly?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
  )
  .then(console.log("successful"))
  .catch((err) => console.log("unable to connect"));

app.use("/", express.static("."));
app.use(express.json());
app.use(express.static("public"));
app.use("/api/v1/", tsAdmin);
app.use("/api/v1/", Invite);
app.use("/api/v1/", auth);
app.use("/api/v1/", validateEmail);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

let port = process.env.PORT || 3001;
app.listen(port, console.log(`Connected to port ${port}`));
