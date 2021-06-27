const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");
const cookieParser = require("cookie-parser");

// router.use(cookieParser());

const CONFIG = require("../config/keys");
const { userInfo } = require("os");

const oauth2Client = new google.auth.OAuth2(
  CONFIG.oauth2Credentials.client_id,
  CONFIG.oauth2Credentials.client_secret,
  CONFIG.oauth2Credentials.redirect_uris[0]
);

google.options({ auth: oauth2Client });

router.get("/", (req, res) => {
  const gAuth_url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: CONFIG.oauth2Credentials.scopes,
  });
  return res.status(200).json({ gauth_url: gAuth_url });
});

function getUsrInfo(token, res) {
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  );

  // Add this specific user's credentials to our OAuth2 client
  oauth2Client.credentials = token;

  //account info
  const acInfo = google.people({ version: "v1", auth: oauth2Client });

  acInfo.people.get(
    {
      resourceName: "people/me",
      personFields: "emailAddresses,names",
    },
    (err, { data }) => {
      if (err) return res.status(422).json(err);
      usrEmail = data["emailAddresses"][0]["value"];
      usrName = data["names"][0]["displayName"];
    }
  );
}

router.get("/auth_callback", async (req, res) => {
  if (req.query.error) {
    return res.status(422).json(req.query.error);
  } else {
    const oauth2Client = new google.auth.OAuth2(
      CONFIG.oauth2Credentials.client_id,
      CONFIG.oauth2Credentials.client_secret,
      CONFIG.oauth2Credentials.redirect_uris[0]
    );
    oauth2Client.getToken(req.query.code, function (err, token) {
      if (err) return res.status(422).json(err);

      oauth2Client.credentials = token;

      //account info
      const acInfo = google.people({ version: "v1", auth: oauth2Client });

      acInfo.people.get(
        {
          resourceName: "people/me",
          personFields: "emailAddresses,names",
        },
        (err, { data }) => {
          if (err) return res.status(422).json(err);
          usrEmail = data["emailAddresses"][0]["value"];
          usrName = data["names"][0]["displayName"];
          User.findOne({ email: usrEmail })
            .then((savedUser) => {
              if (savedUser) {
                return res
                  .status(422)
                  .json({ error: "User already exist with that email" });
              }
              const user = new User({
                email: usrEmail,
                name: usrName,
                googleCredential: token,
              });
              user
                .save()
                .then((user) => {
                  res.cookie("jwt", jwt.sign(token, CONFIG.JWT_SECRET));
                  res.status(200).json({ message: "Added successfully" });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    });
  }
});

module.exports = router;
