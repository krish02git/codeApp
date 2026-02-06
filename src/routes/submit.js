const express = require("express");
const submitRouter = express.Router(); // Creates Route

const userMiddleware = require("../middleware/userMiddleware");
const {submitCode, runCode} = require("../controllers/userSubmission");

submitRouter.post("/submit/:problemId", userMiddleware, submitCode);
submitRouter.post("/run/:problemId", userMiddleware, runCode);




module.exports = submitRouter;