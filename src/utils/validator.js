// Validator Lib :-
const valid = require('validator');

const validate = (data)=>{
    const mandatoryField = ["firstName","emailId","password"];
    const isAllowed = mandatoryField.every(k => Object.keys(data).includes(k));
    if(!isAllowed){
        throw new Error("Field Missing !");
    }
    else{
        if(!valid.isEmail(data.emailId))
            throw new Error("Invalid Email !");
        if(!valid.isStrongPassword(data.password))
            throw new Error("Weak Password !");
        if(!(data.firstName.length >= 3  && data.firstName.length <= 16))
            throw new Error("Size Limit:-\n min:3 & max:16 Char !");
    }
}

module.exports = validate;