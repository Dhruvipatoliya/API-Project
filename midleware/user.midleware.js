const jwt = require('jsonwebtoken')
const userschema = require('../model/user.model')
var user_token = async(req,res,next) =>{
    var usertoken = req.headers.authorization
    console.log(req.cookies);
    if(usertoken){
        var userdata = await jwt.verify(usertoken,process.env.KEY,(err,data)=>{
            if(err){
                console.log(err);
            } else {
                return data;
            }
        })
        console.log(userdata);
        if(userdata == undefined){
            res.json({message:'token invalid'})
        } else {
            var data = await userschema.findById(userdata.id)
            if(data == null){
                res.json({message:'data not found'})
                console.log(data,userdata);
            } else {
                next()
            }
        }
    } else {
        res.json({message:'login required'})
    }
}

module.exports = user_token