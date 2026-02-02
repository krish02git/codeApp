const express = require("express");
const problemRouter = express.Router(); // Creates Route

const adminMiddlerware = require("../middleware/adminMiddleware");

// Create
problemRouter.post("/create",adminMiddlerware, CreateProblem); //admin
// fetch
problemRouter.get("/", getAllProblem); // all problem
problemRouter.get("/:id", getProblemById);
// Solved problem
problemRouter.get("/user", SolvedAllProblemByUser);
// update
problemRouter.patch("/:id",adminMiddlerware, UpdateProblem); // admin
// Delete
problemRouter.delete("/:id",adminMiddlerware, DeleteProblem); // admin


module.exports = problemRouter;