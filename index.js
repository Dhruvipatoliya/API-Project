const express = require('express')
const path = require('path')
const port = process.env.PORT || 8000
const app = express()
const cookieparser = require('cookie-parser')

app.use(express.urlencoded())
require('./config/database')
require('dotenv').config()
app.use(cookieparser())

const cors = require('cors')
app.use(cors())

app.use('/user',require('./router/user.router'))

app.listen(port,(err)=>{
    if(err){
        console.log(err);
    } else {
        console.log('server is running on',port);
    }
})