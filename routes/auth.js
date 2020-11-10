const express = require("express");
const router = express();
const { ts_admin } = require("../models/tsadmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/auth/login", async (req, res) => {
  //   let { error } = validateLogin(req.body);
  //   if (error) return res.status(400).send(error.details[0].message);
  //   console.log(req.body);
  let user = await ts_user.findOne({ Email: req.body.Email });
  if (!user) return res.status(400).send("Invalid user id");

  let result = await bcrypt.compare(req.body.password, user.saltedPassword);
  if (!result) return res.status(400).send("Invalid credentials");

  let token = jwt.sign({ _id: req.body.id }, "PrivateKey");
  res.header("x-auth-token", token).header("Access-control-Allow-Headers");
  console.log(token);
  res.send("logged  In");
});

module.exports = router;
