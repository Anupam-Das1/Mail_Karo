const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");

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
          name = data["names"][0]["displayName"];
          email = data["emailAddresses"][0]["value"];
          User.findOne({ email: email })
            .then((savedUser) => {
              if (savedUser) {
                const cookie = {
                  usrId: savedUser.id,
                  name: name,
                  mail: email,
                  gCredentials: token,
                };
                res.cookie("jwt", jwt.sign(cookie, CONFIG.JWT_SECRET));
                res.redirect("/");
                return res
                  .status(200)
                  .json({ message: "loggedin successfully" });
              }
              const user = new User({
                email: email,
                name: name,
                googleCredential: token,
              });
              user
                .save()
                .then((user) => {
                  const cookie = {
                    usrId: user.id,
                    name: name,
                    mail: email,
                    gCredentials: token,
                  };
                  res.cookie("jwt", jwt.sign(cookie, CONFIG.JWT_SECRET));
                  res.redirect("/");
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

router.post("/auth_callback", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(406).status("token missing");

  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.client_id
  );

  oauth2Client
    .verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    })
    .then((ticket) => {
      const { name, email, picture } = ticket.getPayload();
      // console.log(name, email, picture);
      User.findOne({ email: email })
        .then((savedUser) => {
          if (savedUser) {
            const cookie = {
              usrId: savedUser.id,
              name: savedUser.name,
              mail: savedUser.email,
              gCredentials: token,
            };
            // res.cookie("jwt", jwt.sign(cookie, CONFIG.JWT_SECRET));
            const resToken = jwt.sign(
              { _id: savedUser._id },
              CONFIG.JWT_SECRET
            );
            const { _id, name, email, pic } = savedUser;
            return res.status(200).json({
              message: "loggedin successfully",
              token: resToken,
              user: { _id, name, email, pic },
            });
          }
          const user = new User({
            email: email,
            name: name,
            pic: picture,
            googleCredential: token,
          });
          user
            .save()
            .then((user) => {
              const cookie = {
                usrId: user.id,
                name: name,
                mail: email,
                gCredentials: token,
              };
              // res.cookie("jwt", jwt.sign(cookie, CONFIG.JWT_SECRET));
              const resToken = jwt.sign(
                { _id: savedUser._id },
                CONFIG.JWT_SECRET
              );
              const { _id, name, email, pic } = savedUser;
              return res.status(200).json({
                message: "user added successfully",
                token: resToken,
                user: { _id, name, email, pic },
              });
            })
            .catch((saveusr_err) => {
              // console.log(err);
              return res.status(500).json({
                error: "unable to entry in database",
                err_details: saveusr_err,
              });
            });
        })
        .catch((findusr_err) => {
          // console.log(err);
          return res
            .status(500)
            .json({ error: "google login failed", err_details: findusr_err });
        });
    })
    .catch((oaut_err) => {
      // console.error(err);
      return res
        .status(500)
        .json({ error: "google login failed", err_details: oaut_err });
    });
});

module.exports = router;
