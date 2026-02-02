const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    difficulty: {
        required: true,
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
        required:true
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],
    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            }
        }
    ],
    startCode:[
        {
            language:{
                type:String,
                required:true
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],
    problemCreater:{
        type: Schema.Types.ObjectId, // Admin _id is stored!
        ref:'user', // Refer this collectionsss
        required:true
    },
    referenceSolution:[
        {
            language:{
                type:String,
                required:true
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ]
}, { timestamps: true })


// TableName/collectionName , SchemaFormate
const Problem = mongoose.model("problem", problemSchema);
module.exports = Problem;