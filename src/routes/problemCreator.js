const express = require("express");
const problemRouter = express.Router(); // Creates Route

const adminMiddlerware = require("../middleware/adminMiddleware");
const userMiddleware = require('../middleware/userMiddleware');
const {CreateProblem,UpdateProblem,getAllProblem,getProblemById,SolvedAllProblemByUser,DeleteProblem} = require("../controllers/userProblem");

// CreateProblem
problemRouter.post("/create",adminMiddlerware, CreateProblem); //admin
// fetch problem
problemRouter.get("/getAllProblem",userMiddleware, getAllProblem); // all problem
problemRouter.get("/problemById/:id", userMiddleware, getProblemById);
// Solved problem
problemRouter.get("/problemSloved",userMiddleware, SolvedAllProblemByUser);
// update problem
problemRouter.put("/update/:id",adminMiddlerware, UpdateProblem); // admin --send all 
// Delete problem
problemRouter.delete("/delete/:id",adminMiddlerware, DeleteProblem); // admin


module.exports = problemRouter;