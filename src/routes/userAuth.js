const express = require("express");
const authRouter = express.Router(); // Creates Route

// Add those controllers
const {register,login,logout,adminRegister,deleteProfile,getPfp} = require('../controllers/userAuthentication');

// Add middleware 
const middleware = require("../middleware/userMiddleware");
const adminMiddlerware = require('../middleware/adminMiddleware');

// Register : New User
authRouter.post('/register', register);
// Login : user exist
authRouter.post('/login', login);
// Logout : user exist
authRouter.post('/logout', middleware, logout);
// GetProfile : user exists
// authRouter.get('/getPfp', getPfp);

// Admin Reg : Only admin can do that persons Register as admin
authRouter.post('/admin/register', adminMiddlerware ,adminRegister);
// Delete Account 
authRouter.delete('/deleteProfile',middleware ,deleteProfile);
// check-auth : verify user exist by token
authRouter.get('/check',middleware, (req,res)=>{
    const reply = {firstName:req.result.firstName, emailId:req.result.emailId, _id:req.result._id};
    res.status(200).json({
        user:reply,
        message:"Valid User."
    });
})

module.exports = authRouter;

//  "emailId":"krishhirdesh0102@gmail.com",
// "password":"1@krishKunar"