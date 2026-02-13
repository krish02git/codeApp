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

        const allTestCases = [...problem.visibleTestCases, ...problem.hiddenTestCases];

        // Store Users input in Db - Pending state
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: 'Pending',
            runtime: 0,
            memory: 0,
            testCasesTotal: allTestCases.length,
            testCasesPassed: 0
        });

        const pistonLanguage = getLanguageById(language);
        const startTime = Date.now(); // Measure total execution time

        const submissions = allTestCases.map((testCase) => ({
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

        // problemId in User Schema if not 
        if (status === 'Accepted' && !req.result.problemSolved.includes(problemId)) {
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }

        // Send response
        return res.status(201).send(submittedResult);

    } catch (err) {
        return res.status(500).send("Intenal Error : " + err.message);
    }
}
const runCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const { problemId } = req.params;
        const { code, language } = req.body;

        if (!userId || !code || !problemId || !language) {
            return res.status(400).send("Field Missing");
        }

        // Fetch problem for testCases
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).send("Problem not found");
        }

        const visibleTestCases = problem.visibleTestCases;

        const pistonLanguage = getLanguageById(language);
        const startTime = Date.now();

        const submissions = visibleTestCases.map((testCase) => ({
            language: pistonLanguage,
            version: '*',
            files: [{
                content: code
            }],
            stdin: testCase.input,
            compile_timeout: 10000,
            run_timeout: 3000,
            expected_output: testCase.output
        }));

        const submitResult = await submitBatch(submissions);
        const endTime = Date.now();

        // Calculate runtime
        const totalExecutionTime = endTime - startTime;
        const avgRuntime = Math.round(totalExecutionTime / submitResult.totalTests);

        // Return Piston results
        return res.status(200).json({
            success: true,
            runtime: avgRuntime,
            totalTests: submitResult.totalTests,
            passedTests: submitResult.passedTests,
            failedTests: submitResult.failedTests,
            results: submitResult.results.map((result, index) => ({
                testCase: index + 1,
                input: result.input,
                expectedOutput: result.expected,
                actualOutput: result.actual,
                passed: result.passed,
                stderr: result.stderr,
                exitCode: result.exitCode
            }))
        });

    } catch (err) {
        console.error("Run code error:", err);
        return res.status(500).send("Internal Error : " + err.message);
    }
};



module.exports = { submitCode,runCode};