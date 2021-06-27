const express = require("express");
const google = require("googleapis").google;
const jwt = require("jsonwebtoken");

// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2;

// Including our config file
const CONFIG = require("../config/gAuthConfig");

// Creating our express application
const app = express();

// Allowing ourselves to use cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// const auth = authenticate({
// keyfilePath: path.join(__dirname, "../oauth2.keys.json"),
// scopes: [
// "https://www.googleapis.com/auth/userinfo.email",
// "https://www.googleapis.com/auth/userinfo.profile",
// ],
// });
// google.options({ auth });

app.get("/", function (req, res) {
  // Create an OAuth2 client object from the credentials in our config file
  const oauth2Client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  );

  // Obtain the google login link to which we'll send our users to give us access
  const loginLink = oauth2Client.generateAuthUrl({
    access_type: "offline", // Indicates that we need to be able to access data continously without the user constantly giving us consent
    scope: CONFIG.oauth2Credentials.scopes, // Using the access scopes from our config file
  });
  //   return res.render("index", { loginLink: loginLink });
  //   return res.response(loginLink)
  console.log(loginLink);
  // return res(loginLink);
  // return res.render(loginLink);
});

app.get("/auth_callback", function (req, res) {
  // Create an OAuth2 client object from the credentials in our config file
  const oauth2Client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  );

  if (req.query.error) {
    // The user did not give us permission.
    return res.redirect("/");
  } else {
    oauth2Client.getToken(req.query.code, function (err, token) {
      if (err) return res.redirect("/");

      // Store the credentials given by google into a jsonwebtoken in a cookie called 'jwt'
      res.cookie("jwt", jwt.sign(token, CONFIG.JWTsecret));
      return res.redirect("/get_some_data");
    });
  }
});

app.get("/get_some_data", function (req, res) {
  if (!req.cookies.jwt) {
    // We haven't logged in
    return res.redirect("/");
  }

  // Create an OAuth2 client object from the credentials in our config file
  const oauth2Client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  );

  // Add this specific user's credentials to our OAuth2 client
  oauth2Client.credentials = jwt.verify(req.cookies.jwt, CONFIG.JWTsecret);

  //account info
  const acInfo = google.people({ version: "v1", auth: oauth2Client });

  acInfo.people.get(
    {
      resourceName: "people/me",
      personFields: "emailAddresses",
    },
    (err, res) => {
      if (err) return console.error("The API returned an error: " + err);
      console.log(res.data);
    }
  );

  //gmail
  // const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  // gmail.users.labels.list(
  //   {
  //     userId: "me",
  //   },
  //   (err, res) => {
  //     if (err) return console.log("The API returned an error: " + err);
  //     const labels = res.data.labels;
  //     if (labels.length) {
  //       console.log("Labels:");
  //       labels.forEach((label) => {
  //         console.log(`- ${label.name}`);
  //       });
  //     } else {
  //       console.log("No labels found.");
  //     }
  //   }
  // );
});

// Listen on the port defined in the config file
app.listen(CONFIG.port, function () {
  console.log(`Listening on port ${CONFIG.port}`);
});
