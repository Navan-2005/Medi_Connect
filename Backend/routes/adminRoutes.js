const express = require('express');
const router = express.Router();

const admincontroller = require('../controllers/admincontroller')

const authUser = require('../middlewares/authuser');

router.get('/getalluser',authUser.authUser,admincontroller.getalluser);

router.get('/getalldoctor',authUser.authUser,admincontroller.getalldoctor);

router.post('/updatedoctor',authUser.authUser,admincontroller.updatestatus);

module.exports=router