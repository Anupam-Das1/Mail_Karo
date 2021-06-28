const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const mailSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    sub: {
      type: String,
      required: true,
    },
    second:{

    },
    
    crearedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
); //it will add created add fields

mongoose.model("mail", mailSchema);