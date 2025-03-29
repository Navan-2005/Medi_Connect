const usermodel=require('../models/usermodel');
const doctormodel=require('../models/doctormodel');
module.exports.getalluser=async(req,res)=>{
    try {
        const users=await usermodel.find({});
        res.status(200).send({success:true,data:users,message:'All users fetched'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error,message:"Something went wrong"});
    }
}

module.exports.getalldoctor=async(req,res)=>{
    try {
        const doctors=await doctormodel.find({});
        res.status(200).send({success:true,data:doctors,message:'All doctors fetched'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error,message:"Something went wrong"});
    }
}

module.exports.updatestatus=async(req,res)=>{
    try {
        const {doctorId,status}=req.body;
        const doctor=await doctormodel.findByIdAndUpdate(doctorId,{status});
        const user=await usermodel.findById({_id:doctor.userId});
        const notification=user.notification;
        notification.push({
            type:"status-update-doctor-account",
            message:`Your doctor account has been ${status}`,
            onClickPath:"/notification"
        })
        user.isDoctor=status==='approved' ? true:  false;
        await user.save()
        res.status(200).send({success:true,data:doctor,message:'Doctor status updated'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error,message:"Something went wrong"});
    }
}