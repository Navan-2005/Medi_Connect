const express=require('express');
const colors=require('colors');
const dotenv=require('dotenv');
const morgan=require('morgan');
const cookieparer=require('cookie-parser');
const cors=require('cors');
const userRouter=require('./routes/userRoutes');
const adminrouter=require('./routes/adminRoutes')
const doctorRouter=require('./routes/doctorRoutes')
dotenv.config();
const connectDB=require('./config/db');
connectDB();
require('dotenv').config();
const app=express();
const port=process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieparer());

app.use('/users',userRouter);
app.use('/admin',adminrouter)
app.use('/doctor',doctorRouter)

app.get('/',(req,res)=>{
    res.status(200).send('server is running...');
})

app.listen(port,()=>(
    console.log(`server is running on port ${port}`.yellow.bold)
))