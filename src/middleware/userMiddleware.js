const jwt = require('jsonwebtoken');
const User = require("../models/user");
const redisClient = require("../config/redis");

const userMiddleware = async (req,res,next)=>{
    try{
        const {token} = req.cookies; // req.cookies.token 
        if(!token){
            throw new Error("Token is not present !");
        }
        const payload = jwt.verify(token, process.env.JWT_SECRECT_KEY); //Verfiy if correct return payload
        
        const {_id} = payload;
        if(!_id){
            throw new Error("Id is missing.Invalid Token.")
        }
        const result = await User.findById(_id);
        if(!result){
            throw new Error("_id don't exist.User don't exist.");
        }

        // Redis Blocklist.
        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked){
            throw new Error("Invalid token! Redis Blocklist!");
        }

        req.result = result;
        next();
    }catch(err){
        res.status(401).send("Error : " + err.message);
    }
}

module.exports = userMiddleware;