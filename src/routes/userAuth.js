const express = require("express");
const authRouter = express.Router(); // Creates Route

// Add those controllers
const {register,login,logout,adminRegister,getPfp} = require('../controllers/userAuthentication');

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




module.exports = authRouter;

//  "emailId":"krishhirdesh0102@gmail.com",
// "password":"1@krishKunar"