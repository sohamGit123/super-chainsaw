const { request, response } = require('express')
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const PORT =5000
const mongo_object = require('./keys')


mongoose.connect(mongo_object.MONGOURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongoose")
})
mongoose.connection.on('error',(err)=>{
    console.log("error in connecting",err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

app.listen(PORT,()=>{
    console.log("server is running on ",PORT)
    // console.log(request)
    // console.log(response)
})