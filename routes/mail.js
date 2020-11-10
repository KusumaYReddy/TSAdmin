var AWS = require("aws-sdk");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var fs = require("fs");

//var contents = fs.readFileSync("template.html", "utf8");

async function sendEmail(
  ToAddresses,
  fromAddress,
  subject,
  bodyText,
  main,
  ClickMsg,
  code
) {
  var contents1 = fs.readFileSync("email.html", {
    encoding: "utf8",
    flag: "r",
  });
  AWS.config.update({ region: "us-west-2" });

  const dom = new JSDOM(contents1);

  let template = dom.window.document.getElementById("newtry");
  let templateHtml = template.innerHTML;
  let content = templateHtml
    .replace(/redirecturltoken/g, bodyText)
    .replace(/another user/g, main)
    .replace(/teamshareplan/g, ClickMsg)
    .replace(/coderandom/g, code);
  // var content = fs.readFileSync("email.html", {
  //   encoding: "utf8",
  //   flag: "r",
  // });
  // AWS.config.update({ region: "us-west-2" });

  // const dom = new JSDOM(content);
  // let template = dom.window.document.getElementById("newtry");
  // let templateHtml = template.innerHTML;
  // content = templateHtml.replace(/tokenurlemail/g, bodyText);

  var params = {
    Destination: {
      CcAddresses: [],
      ToAddresses: [ToAddresses],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: content,
        },
        Text: {
          Charset: "UTF-8",
          Data: content,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: "kusuma@slncs.com",
    ReplyToAddresses: ["kusuma@slncs.com"],
  };

  var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  await sendPromise
    .then(function (data) {
      console.log(data);
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
}

function sendValidationEmail(toAddress, token) {
  let fromAddress = "kusuma@slncs.com";
  let subject = "validate email";
  let main = "Validate your email";
  let ClickMsg =
    "You received this email because you signed up for the teamshare. If you didn't request this you can safely delete this email.";

  sendEmail(
    toAddress,
    fromAddress,
    subject,
    "http://localhost:3001/api/v1/validateemail/" + token,
    main,
    ClickMsg
  );
  return;
}

function sendInvitationEmail(toAddress, token, code, user, plan) {
  let fromAddress = "kusuma@slncs.com";
  let subject = "Invitation email";
  //   let main = "Validate your email";
  //   let ClickMsg =
  //     "You received this email because you signed up for the teamshare. If you didn't request this you can safely delete this email.";

  sendEmail(
    toAddress,
    fromAddress,
    subject,
    "http://localhost:3000/api/v1/accountManagement1/" + token,
    user,
    plan,
    code
  );
  return;
}

module.exports.sendValidationEmail = sendValidationEmail;
module.exports.sendInvitationEmail = sendInvitationEmail;
