const express = require("express");
const router = express();
const { Account } = require("../models/account");
const jwt = require("jsonwebtoken");
const { sendInvitationEmail } = require("./mail");
const { ts_admin } = require("../models/tsadmin");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var fs = require("fs");

router.post("/TSAdminWork", async (req, res) => {
  let token = req.header("x-auth-token");
  let decoded = jwt.verify(token, "PrivateKey");
  req.user = decoded;
  let admin = await ts_admin.findById(req.user._id);
  const pricingPlan = {
    planType: req.body.billingContact.pricingPlan.planType,
    numberOfHosts: req.body.billingContact.pricingPlan.numberOfHosts,
    startDate: req.body.billingContact.pricingPlan.startDate,
    validUntill: req.body.billingContact.pricingPlan.validUntill,
  };
  let code = Math.random().toString(36).substring(7);
  let acc = new Account({
    companyName: req.body.companyName,
    InvitationCode: code,
    billingContact: {
      email: req.body.billingContact.Email,
      pricingPlan: req.body.billingContact.pricingPlan,
    },
  });
  const result = await acc.save();

  let planToken = jwt.sign(
    {
      _id: result._id,
      pricingPlan: req.body.billingContact.pricingPlan,
      code: code,
    },
    "PrivateKey"
  );
  console.log(planToken);

  sendInvitationEmail(
    req.body.billingContact.Email,
    planToken,
    code,
    admin.FirstName,
    req.body.billingContact.pricingPlan.planType
  );
  res.send(result);
});

router.get("/accountManagement1/:token", async (req, res) => {
  console.log("inside");
  let decoded = jwt.verify(req.params.token, "PrivateKey");
  req.prevInfo = decoded;

  let puser = await Account.findById(req.prevInfo._id);
  var contents = fs.readFileSync("registration.html", {
    encoding: "utf8",
    flag: "r",
  });

  const dom = new JSDOM(contents);
  //console.log(dom.window.document.getElementById("newtry"));
  let template = dom.window.document.getElementById("newtry");
  let templateHtml = template.innerHTML;
  //console.log(templateHtml);
  templateHtml.value = puser.companyName;
  console.log();
  let content = templateHtml
    .replace(/companyNameValue/g, puser.companyName)
    .replace(/PlanTypeValue/g, puser.billingContact.pricingPlan.planType)
    .replace(
      /numberofhostsvalue/g,
      puser.billingContact.pricingPlan.numberOfHosts
    )
    .replace(/validuntilvalue/g, puser.billingContact.pricingPlan.validUntill);
  //res.sendFile("../tsadmin/registration.html", { root: __dirname });
  //res.render("registration.html", { companyName: "puser.companyName" });
  res.send(content);
});

router.get("/continue/:token", async (req, res) => {
  console.log("inside continue");
  var contents1 = fs.readFileSync("continue.html", {
    encoding: "utf8",
    flag: "r",
  });
  let dom = new JSDOM(contents1);
  let template = dom.window.document.getElementById("newtry1");
  let templateHtml = template.innerHTML;
  token1 =
    "http://localhost:3000/api/v1/accountmanagement1/" + req.params.token;
  let content1 = templateHtml.replace(/redirecturltoken/g, token1);
  res.render(content1);
});

module.exports = router;
