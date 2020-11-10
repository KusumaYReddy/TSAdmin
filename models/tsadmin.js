const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const TSAdmin = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  Email: String,
  Mobile: String,
  saltedPassword: {
    type: String,
    minlength: 8,
  },
  salt: String,
  UserType: String,
  EmailConfirmed: String,
  MobileConfirmed: String,
});

function validateLogin(body) {
  let schema = {
    Email: Joi.string().email(),
    password: Joi.string().min(8),
  };
  return Joi.validate(body, schema);
}
function validateRegBody(request) {
  let schema = {
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),
    Email: Joi.string().email().required(),
    Mobile: Joi.string().required().min(10),
    password: Joi.string().required().min(8),
  };
  return Joi.validate(request, schema);
}
const ts_admin = mongoose.model("ts_admin", TSAdmin);
module.exports.ts_admin = ts_admin;
module.exports.validateLogin = validateLogin;
module.exports.validateRegBody = validateRegBody;
