const express = require("express");
const authRouter = express.Router(); // Creates Route

// Register : New User
authRouter.post('/register', register);
// Login : user exist
authRouter.post('/login', login);
// Logout : user exist
authRouter.post('/logout', logout);
// GetProfile : user exists
authRouter.get('/getPfp', getPfp);