const mongoose = require("mongoose");
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
    required: false,
  },
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/dzwl9sobf/image/upload/v1623638385/default_m2eh5c.jpg",
  },
  googleCredential: {
    type: String,
    required: false,
  },
});

mongoose.model("User", userSchema);
