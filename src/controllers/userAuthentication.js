// bcrypt & jwt :-
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const validate = require('../utils/validator');

const redisClient = require('../config/redis');
const Submission = require('../models/submission');

const register = async (req, res) => {
    try {
        // Default role is user!
        req.body.role = 'user';
        // Validater :-
        validate(req.body);

        // Hashing :-
        req.body.password = await bcrypt.hash(req.body.password, 10);

        // Add to DB :-
        const user = await User.create(req.body);

        // Jwt token created :- jwt key -> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        const token = jwt.sign({ _id: user._id, emailId: req.body.emailId, role:'user' }, process.env.JWT_SECRECT_KEY, { expiresIn: 60 * 60 }) // payload, SecretKey, Time
        const reply = {firstName:user.firstName, emailId:user.emailId, _id:user._id};
        res.cookie('token', token, {
            httpOnly: true,          // JS can't access (XSS protection)
            secure: true,            // HTTPS only (use false in local dev)
            sameSite: "strict",      // CSRF protection
            maxAge: 60 * 60 * 1000   // 1 hour
        }); // key : value : maxAge in ms 

        res.status(201).json({
            user:reply,
            message:`Login Succesfully.`
        });// user data is passed. So that we don't need more req to get users data again for different components.s
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
}

const login = async (req, res)=>{
    try {
        const {emailId, password} = req.body;
        if(!emailId)
            throw new Error("Invalid Credintial");
        if(!password)
            throw new Error("Invalid Credintial");

        // Get email users :-
        const user = await User.findOne({emailId});
        const match = bcrypt.compare(password, user.password);
        if(!match){
            throw new Error("Invalid credintial");
        }
        
        // JWT 
        const token = jwt.sign({_id:user._id, emailId:user.emailId,  role:user.role }, process.env.JWT_SECRECT_KEY, {expiresIn:60*60*1000});
        const reply = {firstName:user.firstName, emailId:user.emailId, _id:user._id};
        res.cookie("token", token);
        res.status(200).json({
            user:reply,
            message:`Login Succesfully.`
        });

    }catch(err){
         res.status(401).send("Error : " + err.message);
    }
}

const logout = async (req,res)=>{
   try{
    // Validate Jwt token :- If don'y exist already logout :- BY Middleware
    // Add in Redis Blacklist :- 
    const token = req.cookies.token;
    const payload = jwt.decode(token);
    await redisClient.set(`token:${token}`, "Block"); // key value
    await redisClient .expireAt(`token:${token}`, payload.exp);
    res.cookie("token", null, {expires : new Date(Date.now())});
    res.send("Logged Out successfully!");
    // clear cookuies :- 
   }catch(err){
    res.status(503).send("Error: " + err.message);
   }
}

const adminRegister= async (req,res)=>{
     try {
        // Default role is user! Admin can do reg for both admin or user.
        // Send role :- by reg admin
        // Validater :-
        validate(req.body);

        // Hashing :-
        req.body.password = await bcrypt.hash(req.body.password, 10);

        // Add to DB :-
        const user = await User.create(req.body);

        // Jwt token created :- jwt key -> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        const token = jwt.sign({ _id: user._id, emailId: req.body.emailId, role:user.role }, process.env.JWT_SECRECT_KEY, { expiresIn: 60 * 60 }) // payload, SecretKey, Time
        res.cookie('token', token, {
            httpOnly: true,          // JS can't access (XSS protection)
            secure: true,            // HTTPS only (use false in local dev)
            sameSite: "strict",      // CSRF protection
            maxAge: 60 * 60 * 1000   // 1 hour
        }); // key : value : maxAge in ms 

        res.status(201).send("User Registered."); // suscess
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
}

const deleteProfile= async (req,res)=>{
    try{
        const userId = req.result._id;
        await User.findByIdAndDelete(userId); // pfp
        // submission delete
        Submission.deleteMany({userId});
        res.status(200).send("Deleted Successsfully.");
    }catch(err){
        res.status(500).send("Server Error : "+ err.message);
    }
}

module.exports = {register, login, logout, adminRegister,deleteProfile};