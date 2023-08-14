const express = require('express')
const router = express.Router()
const {
    register,
    login,
    property,
    allproperty,
    propertydelete,
    propertyupdate,
    house,
    profile,
    profileupdate,
} = require('../controller/user.controller')
const user_token = require('../midleware/user.midleware')
const upload = require('../cloud/multer')

router.post('/register',register)
router.post('/login',login)
router.post('/add-property',user_token,upload.array('propertyimg'),property)
router.get('/allproperty',user_token,allproperty)
router.delete('/propertydelete/:id',user_token,propertydelete)
router.put('/propertyupdate/:id',user_token,upload.array('propertyimg'),propertyupdate)
router.get('/house/:house/:propertyprice',user_token,house)
router.get('/profile',user_token,profile)
router.put('/profileupdate/:id',user_token,upload.single('img'),profileupdate)

module.exports = router