const port = 8080;
const baseURL = `http://localhost:${port}`;

module.exports = {
  // The secret for the encryption of the jsonwebtoken
  JWTsecret: "mysecret",

  baseURL: baseURL,
  port: port,

  // The credentials and information for OAuth2
  oauth2Credentials: {
    client_id:
      "504438976367-lkgjae7k3fu2ufmj85jbqvnilof4rttt.apps.googleusercontent.com",
    project_id: "abiding-topic-285713", // The name of your project
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "jd95pY3F6WG5LJkAm7rVy-jX",
    redirect_uris: [`${baseURL}/auth_callback`],
    scopes: [
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  },
};
