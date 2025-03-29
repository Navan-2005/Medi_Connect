const express=require('express');
const router=express.Router();
const authUser=require('../middlewares/authuser');

const usercontroller=require('../controllers/usercontroller')

router.post('/register',usercontroller.register);

router.post('/login',usercontroller.login);

router.get('/getuser',authUser.authUser,usercontroller.getuser);

router.post('/apply-doctor',usercontroller.applydoctorctr);

router.post('/get-all-notification',usercontroller.getallnotification);

router.post('/delete-all-notification',usercontroller.deleteallnotification);

router.get('/getalldoctors',authUser.authUser,usercontroller.getalldoctors);

router.post('/appointment',authUser.authUser,usercontroller.bookappointment);

router.post('/availability',authUser.authUser,usercontroller.availability);

router.post('/appointments',authUser.authUser,usercontroller.userappointment);

module.exports=router