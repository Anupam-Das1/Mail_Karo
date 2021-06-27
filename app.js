const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");
const PORT = process.env.PORT || 8080;

const cors = require("cors");
app.use(cors());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongo yeah!!!!!!!");
});
mongoose.connection.on("error", (err) => {
  console.log(" oops not connected  !!!!!!!", err);
});

require("./models/user");
require("./models/mail");
app.use(express.json());
app.use(require("./routes/auth"));
app.use("/gauth", require("./routes/authGoogle"));
app.use("/mail", require("./routes/mail"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server running on ", PORT);
});
