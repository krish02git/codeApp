const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { getLanguageById, submitBatch, getFileName } = require("../utils/ProblemUtility");

const submitCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const { problemId } = req.params;
        const { code, language } = req.body;

        if (!userId || !code || !problemId || !language) {
            return res.status(400).send("Field Missing.");
        }

        // Fetch problem for testCases
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).send("Problem not found.");
        }

        // Store Users input in Db - Pending state
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: 'Pending',
            runtime: 0,
            memory: 0,
            testCasesTotal: problem.hiddenTestCases.length,
            testCasesPassed: 0
        });

        const pistonLanguage = getLanguageById(language);
        const startTime = Date.now(); // Measure total execution time
        
        const submissions = problem.hiddenTestCases.map((testCase) => ({
            language: pistonLanguage,
            version: '*',
            files: [{
                name: getFileName(pistonLanguage),
                content: code
            }],
            stdin: testCase.input,
            compile_timeout: 10000,
            run_timeout: 3000,
            expected_output: testCase.output
        }));

        const submitResult = await submitBatch(submissions);
        const endTime = Date.now();
        
        // Calculate approximate runtime
        const totalExecutionTime = endTime - startTime;
        const avgRuntime = Math.round(totalExecutionTime / submitResult.totalTests);
        
        // Determine status based on results
        let status = 'Accepted';
        let errorMessage = '';

        // Check if any test has stderr (runtime/compilation error)
        const hasError = submitResult.results.some(test => test.stderr && test.stderr.trim().length > 0);
        
        if (hasError) {
            status = 'Error';
            const errorTest = submitResult.results.find(test => test.stderr);
            errorMessage = errorTest.stderr;
        } else if (!submitResult.allPassed) {
            status = 'Wrong Answer';
        }

        // Estimate memory based on language (rough estimates in KB)
        const memoryEstimates = {
            'python': 15000,
            'cpp': 2000,
            'c': 1500,
            'java': 40000,
            'javascript': 20000,
            'go': 5000,
            'rust': 2000
        };
        const estimatedMemory = memoryEstimates[language] || 10000;

        // Update submission in database
        submittedResult.status = status;
        submittedResult.testCasesPassed = submitResult.passedTests;
        submittedResult.runtime = avgRuntime;
        submittedResult.memory = estimatedMemory;
        submittedResult.errorMessage = errorMessage;
        
        await submittedResult.save();

        // Send response
        return res.status(201).send(submittedResult);

    } catch (err) {
        return res.status(500).send("Intenal Error : " + err.message);
    }
}

module.exports = { submitCode };