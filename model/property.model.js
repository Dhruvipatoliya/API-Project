const mongoose = require('mongoose')
const propertyschema = new mongoose.Schema({
    propertyname:{
        type:String
    },
    propertyprice:{
        type:Number
    },
    propertyimg:{
        type:Array
    },
    propertyimg_id:{
        type:Array
    },
    propertyfacility:{
        type:Array
    },
    house:{
        type:String
    },
})
module.exports = mongoose.model('property',propertyschema)