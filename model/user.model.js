const mongoose = require('mongoose')
const userschema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    img:{
        type:String
    },
    img_id:{
        type:String
    },
})
module.exports = mongoose.model('user',userschema)