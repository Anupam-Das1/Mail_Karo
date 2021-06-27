const mongoose = require("mongoose");
const { stringify } = require("querystring");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: null,
    required: true,
  },
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/dzwl9sobf/image/upload/v1623638385/default_m2eh5c.jpg",
  },
  googleCredentials: {
    type: String,
    default: null,
    required: true,
  },
});

mongoose.model("User", userSchema);
