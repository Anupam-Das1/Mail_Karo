const express=require('express')
const app=express()
const mongoose=require('mongoose')
const {MONGOURI}=require('./config/keys')
const PORT=process.env.PORT || 5000;

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo yeah!!!!!!!")
})
mongoose.connection.on('error',(err)=>{
    console.log(" oops not connected  !!!!!!!",err)
})

require('./models/user')
app.use(express.json())
app.use(require('./routes/auth'))

app.listen(PORT,()=>{
    console.log("server running on 5000")
})