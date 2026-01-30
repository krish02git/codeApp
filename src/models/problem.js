const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        require: true,
        type: String
    },
    description: {
        require: true,
        type: String
    },
    difficulty: {
        require: true,
        type: String,
        enum: ['Easy', 'Medium', 'Hard']
    },
    tags: {
        type: String,
        enum: [
            "Array",
            "String",
            "Linked List",
            "Matrix",
            "Hash Table",
            "Stack",
            "Queue",
            "Heap",
            "Priority Queue",
            "Tree",
            "Binary Tree",
            "Binary Search Tree",
            "Graph",
            "Trie",
            "Dynamic Programming",
            "Greedy",
            "Backtracking",
            "Recursion",
            "Sorting",
            "Searching",
            "Binary Search",
            "Two Pointers",
            "Sliding Window",
            "Breadth First Search",
            "Depth First Search",
            "Topological Sort",
            "Shortest Path",
            "Minimum Spanning Tree",
            "Union Find",
            "Bit Manipulation",
            "Math",
            "Database",
            "Design",
            "Concurrency"
        ],
        require:true
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                require:true
            },
            output:{
                type:String,
                require:true
            },
            explanation:{
                type:String,
                require:true
            }
        }
    ],
    hiddenTestCases:[
        {
            input:{
                type:String,
                require:true
            },
            output:{
                type:String,
                require:true
            }
        }
    ],
    startCode:[
        {
            language:{
                type:String,
                require:true
            },
            initialCode:{
                type:String,
                require:true
            }
        }
    ],
    problemCreater:{
        type: Schema.Types.ObjectId, // Admin _id is stored!
        ref:'user', // Refer this collectionsss
        require:true
    }
}, { timestamps: true })


// TableName/collectionName , SchemaFormate
const Problem = mongoose.model("problem", problemSchema);
module.exports = Problem;