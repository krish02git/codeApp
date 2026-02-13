const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['python', 'cpp', 'c', 'java', 'javascript', 'go', 'rust']
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending','Accepted', 'Wrong Answer', 'Error']
    },
    runtime: {
        type: Number, // in milliseconds
        required: true
    },
    memory: {
        type: Number, // in KB or MB
        required: true
    },
    errorMessage:{
        type:String,
        default:''
    },
    testCasesTotal: {
        type: Number,
        required: true
    },
    testCasesPassed: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Indexing : compound Index. 1-> both fields are arranged in ascending order.
submissionSchema.index({userId:1, problemId:1});

const Submission = mongoose.model('submission', submissionSchema);
module.exports = Submission;