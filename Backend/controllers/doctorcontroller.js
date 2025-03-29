const doctormodel=require('../models/doctormodel');
const appointmentModel=require('../models/appointmentmodel');
const usermodel=require('../models/usermodel');
module.exports.getdoctor=async(req,res)=>{
    try {
        const doctor=await doctormodel.findOne({userId:req.body.userId});
        res.status(200).send({
            success:true,
            data:doctor,
            message:"Doctor fetched successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        })
    }
}

module.exports.updateprofile=async(req,res)=>{
    try {
        const doctor=await doctormodel.findOneAndUpdate({userId:req.body.userId},req.body);
        res.status(200).send({
            success:true,
            data:doctor,
            message:"Doctor profile updated successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        })
    }
}

module.exports.getsingledoctor=async(req,res)=>{
    try {
        const doctor=await doctormodel.findOne({_id:req.body.doctorId});
        res.status(200).send({
            success:true,
            data:doctor,
            message:"Doctor fetched successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        })
    }
}

module.exports.appointment=async(req,res)=>{
    try {
        const doctor=await doctormodel.findOne({userId:req.body.userId});
        const appointments=await appointmentModel.find({doctorId:doctor._id});
        const user =await usermodel.findOne({_id:appointments[0].userId});
        const username=user.username;
        res.status(200).send({
            success:true,
            data:appointments,
            user:username,
            message:"Appointments fetched successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        })
    }
}

module.exports.updatestatus=async(req,res)=>{
    try {
        const {appointmentId,status}=req.body;
        const appointment=await appointmentModel.findByIdAndUpdate(appointmentId,{status});
        const user=await usermodel.findOne({_id:appointmentId.userId});
        const notification=user.notification;
        notification.push({
            type:"status-update-appointment-request",
            message:`Your appointment request has been ${status}`,
            onClickPath:"/user/appointments"
        })
        await user.save();
        res.status(200).send({
            success:true,
            data:appointment,
            message:"Appointment status updated successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        })
    }
}
