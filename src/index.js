//  config env :-
require('dotenv').config();

// Server Created :- 
const express = require('express');
const app = express();
app.use(express.json()); // req.body in json -to> jsObject 

// bcrypt & jwt & cookies used in password area:-
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// DB :-
const main = require('./config/DB');
const redisClient = require('./config/redis');

// Router :-
const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");



app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission',submitRouter);




const Connection = async ()=>{
    try{
        await Promise.all([redisClient.connect(), main()]);
        console.log("Connected to Redis & mongoose DB !");


        app.listen(process.env.PORT, ()=>{
            console.log("Port is listening  " + process.env.PORT);
        })
    }catch(Err){
        console.log("ERROR : " + Err.message);
    }
}
Connection();