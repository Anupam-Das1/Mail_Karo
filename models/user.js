const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true 
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dzwl9sobf/image/upload/v1623638385/default_m2eh5c.jpg"
    },
})

mongoose.model("User",userSchema)