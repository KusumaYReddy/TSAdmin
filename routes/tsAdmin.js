const express = require("express");
const router = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ts_admin } = require("../models/tsadmin");
const { sendValidationEmail } = require("./mail");

router.post("/register", async (req, res) => {
  //   let { error } = validateRegBody(req.body);
  //   if (error) return res.status(400).send(error.details[0].message);
  let salt = await bcrypt.genSalt(10);
  const saltedpassword = await bcrypt.hash(req.body.password, salt);
  let user = new ts_admin({
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Email: req.body.Email,
    Mobile: req.body.Mobile,
    salt: salt,
    saltedPassword: saltedpassword,
    UserType: "Admin",
    EmailConfirmed: "NotVerified",
  });

  let result = await user.save();

  console.log(result);
  let token = jwt.sign(
    {
      _id: result._id,
    },
    "PrivateKey"
  );
  //sendValidationEmail(req.body.Email, token);

  res.send(token);
});

module.exports = router;
