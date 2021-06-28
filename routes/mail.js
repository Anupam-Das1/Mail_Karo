const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Email = mongoose.model("mail");
// const User = mongoose.model("user");
const User=mongoose.model("User")
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");
const { google } = require("googleapis");
const { sendGmail } = require("../services/gmail");
const CONFIG = require("../config/dev");

router.get("/", (req, res) => {
  if (!req.cookies.jwt) return res.status(403).json({ error: "not loggedin" });

  return res.status(200).json({ status: "loggedin" });
});

router.post("/sendgmail", (req, res) => {
  const { to, cc, body, sub, from } = req.body;
  if (!to || !cc || !body || !sub || !from) {
    return res.status(422).json({ error: "Please add all fields" });
  }
  User.findOne({ email: from })
    .then((savedUser) => {
      sendGmail(savedUser.googleCredentials, req.body);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mails", (req, res) => {
  if (!req.cookies.jwt) return res.status(403).json({ error: "not loggedin" });
  let cookie = jwt.verify(req.cookies.jwt, CONFIG.JWT_SECRET);

  // Create an OAuth2 client object from the credentials in our config file
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  );

  // Add this specific user's credentials to our OAuth2 client
  oauth2Client.credentials = cookie.gCredentials;
  console.log(cookie.gCredentials);
  //account info
  const acInfo = google.people({ version: "v1", auth: oauth2Client });

  acInfo.people.get(
    {
      resourceName: "people/me",
      personFields: "emailAddresses",
    },
    (err, userInfoRes) => {
      if (err) return console.error("The API returned an error: " + err);
      return res.status(200).json(userInfoRes.data);
    }
  );
});

router.post("/create", (req, res) => {
  if (!req.cookies.jwt) return res.status(403).json({ error: "not loggedin" });
  let cookie = jwt.verify(req.cookies.jwt, CONFIG.JWT_SECRET);

  const formMail = req.body;
  const newMail = new mail({
    to: formMail.to,
    cc: formMail.cc,
    sub: formMail.sub,
    body: formMail.body,
    createdBy: User(cookie.userId),
  });
});

module.exports = router;
