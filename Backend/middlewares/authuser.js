const userModel = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    console.log('Token : ',token);
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(decoded._id)
          
        req.user = user;
        console.log('Athourised user', user);
        
        return next();
    
    } catch (err) {
        console.log(err);
        
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
    