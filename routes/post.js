const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const User=mongoose.model("User")
const requireLogin=require('../middleware/requireLogin')
const Post=mongoose.model("Post")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

const {sendGmail}=require('../services/gmail')

router.post("/sendgmail", (req, res) => {
    const { to,cc,body,sub,from  } = req.body;
    if(!to || !cc || !body || !sub || !from){
        return res.status(422).json({error:"Please add all fields"})
    }
    User.findOne({email:from})
     .then((savedUser)=>{
        sendGmail(savedUser.googleCredentials,req.body)
    }).catch(err=>{
        console.log(err)
    })
});

module.exports=router
