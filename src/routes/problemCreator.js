const express = require("express");
const problemRouter = express.Router(); // Creates Route

// Create
problemRouter.post("/create", problemCreate); //admin
// fetch
problemRouter.get("/", problemFetch); // all problem
problemRouter.get("/:id", problemFetch);
// Solved problem
problemRouter.get("/user", problemSolved);
// update
problemRouter.patch("/:id", problemUpdate); // admin
// Delete
problemRouter.delete("/:id", problemDelete); // admin


module.exports = problemRouter;