// bcrypt & jwt :-
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');
const validate = require('../utils/validator');

const register = async (req, res) => {
    try {
        // Validater :-
        validate(req.body);

        // Hashing :-
        req.body.password = await bcrypt.hash(req.body.password, 10);

        // Add to DB :-
        const user = await User.create(req.body);

        // Jwt token created :- jwt key -> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        const token = jwt.sign({ _id: user._id, emailId: req.body.emailId }, process.env.JWT_SECRECT_KEY, { expiresIn: 60 * 60 }) // payload, SecretKey, Time
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
        const token = jwt.sign({_id:user._id, emailId:user.emailId}, process.env.JWT_SECRECT_KEY, {expiresIn:60*60*1000});
        res.cookie("token", token);
        res.status(200).send("Logged in successfully");

    }catch(err){
         res.status(401).send("Error : " + err.message);
    }
}

const logout = async (req,res)=>{
   try{
    
   }catch(err){

   }
}

module.exports = {register, login, logout};