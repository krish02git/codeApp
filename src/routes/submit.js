const express = require("express");
const submitRouter = express.Router(); // Creates Route

const userMiddleware = require("../middleware/userMiddleware");
const {submitCode, runCode} = require("../controllers/userSubmission");
const { submitCodeRateLimiter, runCodeRateLimiter } = require("../RateLimiter/testing");

submitRouter.post("/submit/:problemId", userMiddleware,submitCodeRateLimiter, submitCode);
submitRouter.post("/run/:problemId", userMiddleware,runCodeRateLimiter, runCode);




module.exports = submitRouter;