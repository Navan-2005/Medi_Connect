const express=require('express');
const router=express.Router();
const doctorctr=require('../controllers/doctorcontroller')
const authUser=require('../middlewares/authuser');

router.post('/getdoctor',authUser.authUser,doctorctr.getdoctor)

router.post('/updateprofile',authUser.authUser,doctorctr.updateprofile)

router.post('/getsingledoctor',authUser.authUser,doctorctr.getsingledoctor)

router.post('/appointment',authUser.authUser,doctorctr.appointment)

router.post('/updatestatus',authUser.authUser,doctorctr.updatestatus)
module.exports=router