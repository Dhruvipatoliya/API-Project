const express = require('express')
const userschema = require('../model/user.model')
const propertyschema = require('../model/property.model')
var userjwt = require('jsonwebtoken')
const cloudinary = require('../cloud/cloudinary')

//register post method
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log(req.body);
        if (name == '' || email == '' || password == '') {
            res.json({ message: 'name, email or password is not found' })
        } else {
            var find = await userschema.findOne({ email })
            if (find == null) {
                var data = await userschema.create(req.body)
                res.json({ message: 'user registered successfully' })
            } else {
                res.json({ message: 'email already exits' })
            }
        }
    } catch (error) {
        console.log(error, 'catch error');
    }
}

//login post method
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(req.body);
        if (email == '' || password == '') {
            res.josn({ message: 'email or password is not found' })
        } else {
            var find = await userschema.findOne({ email })
            if (find == null) {
                res.json({ message: 'please register or enter valid email address' })
            } else {
                if (find.password == password) {
                    var token = await userjwt.sign({ id: find._id }, process.env.KEY)
                    res.cookie('user_jwt', token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
                    console.log(token);
                    res.json({ message: 'login successfully', token })
                } else {
                    res.json({ message: 'please enter valid password' })
                }
            }
        }
    } catch (error) {
        console.log(error, 'catch error');
    }
}

//property post method
exports.property = async (req, res) => {
    try {
        console.log(req.files);
        const { propertyname, propertyprice, propertyimg, propertyfacility, house } = req.body
        if (propertyname == '' || propertyprice == '' || propertyimg == '' || propertyfacility == '' || house == '') {
            res.json({ message: 'some field is missing' })
        } else {
            var files = req.files
            var propertyimg_id = []
            var property_img = []
            for (var file of files) {
                var imgdata = await cloudinary.uploader.upload(file.path)
                property_img.push(imgdata.secure_url)
                propertyimg_id.push(imgdata.public_id)
            }

            var data = await propertyschema.create({
                propertyname, propertyprice, propertyimg: property_img, propertyimg_id, propertyfacility, house
            })
            if (data) {
                res.json({ message: 'property data added successfully' })
            } else {
                res.json({ message: 'property data not added successfully' })
            }
        }
    } catch (error) {
        console.log(error, 'catch error');
    }
}

//all property get methos
exports.allproperty = async (req, res) => {
    try {
        var data = await propertyschema.find({})
        res.json(data)
    } catch (error) {
        console.log(error, 'catch error');
    }
}

//property delete delete method
exports.propertydelete = async (req, res) => {
    try {
        var data = await propertyschema.findById(req.params.id)
        for (var i = 0; i < data.propertyimg_id.length; i++) {
            cloudinary.uploader.destroy(data.propertyimg_id[i], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            })
        }
        var deletedata = await propertyschema.findByIdAndDelete(req.params.id)
        if (deletedata) {
            res.json({ message: 'property data deleted successfully' })
        } else {
            res.json({ message: 'property data not deleted successfully' })
        }
    } catch (error) {
        console.log(error, 'catch error');
    }
}

//property update put method
exports.propertyupdate = async (req, res) => {
    try {
        if (req.files) {
            var data = await propertyschema.findById(req.params.id)
            for (var i = 0; i < data.propertyimg_id.length; i++) {
                if (data.propertyimg_id) {
                    cloudinary.uploader.destroy(data.propertyimg_id[i], (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(result);
                        }
                    })
                }
            }

            var files = req.files
            var property_img = []
            var propertyimg_id = []
            for (var file of files) {
                const imgdata = await cloudinary.uploader.upload(file.path)
                property_img.push(imgdata.secure_url)
                propertyimg_id.push(imgdata.public_id)
            }
            req.body.propertyimg=property_img
            req.body.propertyimg_id=propertyimg_id

            var update = await propertyschema.findByIdAndUpdate(req.params.id, req.body)
            if (update) {
                res.json({ message: 'property data updated successfully' })
            } else {
                res.json({ message: 'property data not updated successfully' })
            }
        } else {
            var update = await propertyschema.findByIdAndUpdate(req.params.id, req.body)
            if (update) {
                res.json({ message: 'property data updated successfully' })
            } else {
                res.json({ message: 'property data not updated successfully' })
            }
        }
    } catch (error) {
        console.log(error, 'catch error');
    }
}

//house property get method
exports.house = async (req, res) => {
    try {
        console.log(req.params);
        var data = await propertyschema.find({ house: req.params.house, propertyprice: { $gt: req.params.propertyprice } })
        res.json(data)
    } catch (error) {
        console.log(error, 'catch error');
    }
}

//profile get method
exports.profile = async (req, res) => {
    try {
        console.log(req.headers);
        var decode = await userjwt.verify(req.headers.authorization, process.env.KEY)
        var data = await userschema.findById(decode.id)
        res.json(data)
    } catch (error) {
        console.log(error, 'catch error');
    }
}

//profile data update put method
exports.profileupdate = async (req, res) => {
    try {
        if (req.file) {
            var data = await userschema.findById(req.params.id)
            if (data.img_id) {
                cloudinary.uploader.destroy(data.img_id, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                    }
                })
            }
            var imgdata = await cloudinary.uploader.upload(req.file.path)
            req.body.img = imgdata.secure_url
            req.body.img_id = imgdata.public_id

            var update = await userschema.findByIdAndUpdate(req.params.id, req.body)
            if (update) {
                res.json({ message: 'profile data updated successfully' })
            } else {
                res.json({ message: 'profile data not updated successfully' })
            }
        } else {
            var update = await userschema.findByIdAndUpdate(req.params.id, req.body)
            if (update) {
                res.json({ message: 'profile data updated successfully' })
            } else {
                res.json({ message: 'profile data not updated successfully' })
            }
        }
    } catch (error) {
        console.log(error, 'catch error');
    }
}