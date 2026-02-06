const mongoose = require('mongoose');
const { Schema } = mongoose;

// Document1 
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 15
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 15
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 254,
        index: true,
        match: /^\S+@\S+\.\S+$/,
        immutable: true
    },
    age: {
        type: Number,
        min: 12,
        max: 80,
        validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not an integer"
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    //unique
    problemSolved: {
        type: [{
            type:Schema.Types.ObjectId, //problemId
            ref:'problem'
        }],
        unique:true,
        default: []
    },password :{
        type:String,
        required : true
    }

}, { timestamps: true })

// TableName/collectionName , SchemaFormate
const User = mongoose.model("user", userSchema);
module.exports = User;