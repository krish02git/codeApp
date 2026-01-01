//  config env :-
require('dotenv').config();

// Server Created :- 
const express = require('express');
const app = express();
app.use(express.json()); // req.body in json -to> jsObject 

// bcrypt & jwt & cookies :-
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// DB :-
const main = require('./config/DB');
const cookieParser = require('cookie-parser');
















const Connection = async ()=>{
    try{
        await main();
        console.log("Connected to mongoose DB !");

        app.listen(process.env.PORT, ()=>{
            console.log("Port is listening  " + process.env.PORT);
        })
    }catch(Err){
        console.log("ERROR : " + Err.message);
    }
}
Connection();