const mongoose = require("mongoose");
const Joi = require("joi");

const accountSchema = new mongoose.Schema({
  adminId: {
    type: String,
  },
  CompanyUsers: {
    type: [String],
  },
  companyName: String,
  InvitationCode: String,
  billingContact: {
    name: String,
    email: String,
    mobileNumber: Number,
    password: String,
    workNumber: Number,
    faxNumber: Number,
    address: {
      city: String,
      street: String,
      houseNumber: [Number],
    },
    paymentMethod: {
      card: {
        cardType: String, //visa master cards
        name: String,
        cardNumber: Number,
        expiry: String,
        cvvCode: Number,
      },
      bank: {
        name: String,
        routingNumber: Number,
        accountNumber: Number,
      },
      invoice: {
        frequency: String, //monthly
      },
    },
    pricingPlan: {
      planType: String,
      numberOfHosts: Number,
      startDate: Date,
      validUntill: Date,
    },
  },
});

const Account = mongoose.model("Account", accountSchema);
module.exports.Account = Account;
