const { google } = require("googleapis");
const CONFIG = require("../config/dev");

function encodeMail({ to, cc, from, sub, body }) {
  var str = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ",
    to,
    "\n",
    "cc: ",
    cc,
    "from: ",
    from,
    "\n",
    "subject: ",
    sub,
    "\n\n",
    body,
  ].join("");

  let encodedMail = new Buffer(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return encodedMail;
}

function sendGmail(token, mailBody) {
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  );
  oauth2Client.credentials = token;
  let rawMailBody;
  if (!mailBody)
    rawMailBody = encodeMail({
      to: ["anupam43345@gmail.com", "www.arnab4@gmail.com"],
      cc: "",
      from: "ab.inpathtoadev@gmail.com",
      sub: "test",
      body: "test body",
    });
  else rawMailBody = encodeMail(mailBody);
  // console.log(rawMailBody);
  google.gmail({ version: "v1", auth: oauth2Client }).users.messages.send(
    {
      userId: "me",
      resource: {
        raw: rawMailBody,
      },
    },
    (err, res) => {
      console.log(err || res);
    }
  );
}

module.exports = sendGmail;

sendGmail(token);
