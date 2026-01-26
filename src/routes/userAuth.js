const express = require("express");
const authRouter = express.Router(); // Creates Route

// Add those controllers
const {register,login,logout,getPfp} = require('../controllers/userAuthentication');

// Add middleware 
const middleware = require("../middleware/userMiddleware");

// Register : New User
authRouter.post('/register', register);
// Login : user exist
authRouter.post('/login', login);
// Logout : user exist
authRouter.post('/logout', middleware, logout);
// GetProfile : user exists
// authRouter.get('/getPfp', getPfp);




module.exports = authRouter;