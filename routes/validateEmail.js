const express = require("express");
const router = express();
const { ts_admin } = require("../models/tsadmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.put("/validateemail/:token", async (req, res) => {
  //console.log(token);
  let decoded = jwt.verify(req.params.token, "PrivateKey");
  req.user = decoded;
  console.log(req.user);
  let newuser = await ts_user.findByIdAndUpdate(
    req.user._id,
    {
      EmailConfirmed: "Verified",
    },
    { new: true }
  );
  res.send(newuser);
});

module.exports = router;
