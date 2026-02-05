const express = require("express");
const submitRouter = express.Router(); // Creates Route

const userMiddleware = require("../middleware/userMiddleware");
const {submitCode} = require("../controllers/userSubmission");

submitRouter.post("/submit/:id", userMiddleware, submitCode);