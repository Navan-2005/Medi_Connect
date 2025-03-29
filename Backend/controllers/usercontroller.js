const usermodel = require('../models/usermodel')
const doctormodel=require('../models/doctormodel')
const appointmentModel=require('../models/appointmentmodel')
const moment=require('moment');

module.exports.register=async(req,res)=>{
    const {username,email,password}=req.body;
    const exist=await usermodel.findOne({email});
    if(exist)
    {
        console.log(`Username ${username} already exists.`);
        return res.status(400).json({ message: `Username ${username} already exists.` });
    }
    const hashPassword=await usermodel.hashPassword(password);
    const user=await usermodel.create({
        username,
        email,
        password:hashPassword
    })
    console.log(user);
    const token=user.generateAuthToken();
    res.status(201).json({user,token});
}

module.exports.login=async(req,res)=>{
    const {email,password}=req.body;
    const user=await usermodel.findOne({email});
    if(!user)
    {
        return res.status(401).json({ message: 'Invalid username or password',success:false });

    }
    const isMatch=await user.comparePassword(password,user.password);
    if(!isMatch)
    {
        return res.status(401).json({ message: 'Invalid username or password',success:false });

    }
    const token=user.generateAuthToken();
    res.cookie('token', token);

    console.log('token : ',token);
    

    res.status(200).json({user,token,success:true});
}

module.exports.getuser=async(req,res)=>{

    res.status(200).json(req.user);
}

module.exports.applydoctorctr=async(req,res)=>{
    try {
        const newDoctor= await doctormodel({...req.body,status:"pending"});
        await newDoctor.save();
        const adminuser=await usermodel.findOne({isAdmin:true});
        const notification=adminuser.notification;
        notification.push({
            type:"apply-doctor-request",
            message:`${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            doctorId:newDoctor._id,
            name:newDoctor.firstName+" "+newDoctor.lastName,
            onClickPath:"/admin/doctors"
        })
        await usermodel.findByIdAndUpdate(adminuser._id,{notification});
        res.status(201).send({success:true,message:"Doctor account applied successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error,message:"Something went wrong"});
    }
}

module.exports.getallnotification=async(req,res)=>{
    try {
      const user=await usermodel.findOne({_id:req.body.userId});
      const seennotification=user.seennotification;
      const notification=user.notification;
      seennotification.push(...notification);
      user.notification=[];
      user.seennotification=notification
      const updateduser=await user.save();
      console.log('seen notification : ',user.seennotification);
      
      res.status(200).send({success:true,data:updateduser,message:"Notification fetched successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error,message:"Something went wrong"});
        
    }
}

module.exports.deleteallnotification=async(req,res)=>{
    try {
        const user=await usermodel.findOne({_id:req.body.userId});
        user.notification=[];
        user.seennotification=[];
        const updateduser=await user.save();
        res.status(200).send({success:true,data:updateduser,message:"Notification deleted successfully"});
    } catch (error) {
        console.log(error); 
        res.status(500).json({success:false,error,message:"Something went wrong"});
    }
}

module.exports.getalldoctors=async(req,res)=>{
    try {
        const doctors=await doctormodel.find({status:"approved"});
        console.log(doctors);
        
        res.status(200).send({success:true,data:doctors,message:"Doctors fetched successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error,message:"Something went wrong"});
    }
}

module.exports.bookappointment=async(req,res)=>{
    try {
        req.body.date=moment(req.body.date,"DD-MM-YYYY").toISOString();
        req.body.time=moment(req.body.time,"HH:mm").format("HH:mm");
        req.body.status="pending";
        const newAppointment=await appointmentModel(req.body);
        await newAppointment.save();
        const user=await usermodel.findOne({_id:req.body.doctorInfo.userId});
        user.notification.push({
            type:"new-appointment-request",
            message:`A new appointment request has been made from ${req.body.userInfo.name}`,
            onClickPath:"/user/appointments"
        })
        await user.save();
        res.status(201).send({success:true,data:newAppointment,message:"Appointment booked successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error,message:"Something went wrong"});
    }
}

module.exports.availability = async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString(); // Changed format to match your input
        const fromTime = moment(req.body.time, "HH:mm")
            .subtract(1, "hours")
            .toISOString();
        const toTime = moment(req.body.time, "HH:mm")
            .add(1, "hours")
            .toISOString();
        const doctorId = req.body.doctorId;

        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: {
                $gte: fromTime,
                $lte: toTime,
            },
        });

        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointments not Available at this time",
                success: false, // Changed to false
            });
        } else {
            return res.status(200).send({
                success: true,
                message: "Appointments available",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In Booking",
        });
    }
};

module.exports.userappointment = async (req, res) => {
    try {
        
        const appointments = await appointmentModel.find({
          userId: req.body.userId,
        });
        const doctor = await doctormodel.findOne({
          _id: appointments[0].doctorId,
        })
        const doctorName = doctor.firstName + " " + doctor.lastName
        console.log('Appointments : ',appointments);
        res.status(200).send({
          success: true,
          message: "Users Appointments Fetch SUccessfully",
          data: appointments,
          doctor:doctorName
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error In User Appointments",
        });
      }
    };