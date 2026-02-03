const Problem = require('../models/problem');
const { getLanguageById, submitBatch ,getFileName} = require('../utils/ProblemUtility');

const CreateProblem = async (req, res) => {
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, problemCreater, referenceSolution } = req.body;

    try {
        // Validate all reference solutions
        for (const { language, initialCode } of referenceSolution) {
            const pistonLanguage = getLanguageById(language);

            const submissions = visibleTestCases.map((testCase) => ({
                language: pistonLanguage,
                version: '*',
                files: [{
                    name: getFileName(pistonLanguage), 
                    content: initialCode
                }],
                stdin: testCase.input,
                compile_timeout: 10000,
                run_timeout: 3000,
                expected_output: testCase.output
            }));

            // submitBatch returns results DIRECTLY (no tokens!)
            const submitResult = await submitBatch(submissions);

            // Check if all tests passed
            if (!submitResult.success || !submitResult.allPassed) {
                return res.status(400).json({
                    success: false,
                    message: `Reference solution for ${language} failed test cases`,
                    language: language,
                    failedTests: submitResult.results.filter(r => !r.passed),
                    passedTests: submitResult.passedTests,
                    totalTests: submitResult.totalTests
                });
            }

            console.log(`Reference solution for ${language} passed all ${submitResult.totalTests} test cases`);
        }

        // All reference solutions passed - create the problem
        const newProblem = await Problem.create({
            ...req.body,
            problemCreater: req.result._id
        });

        res.status(201).send("problem saved successfully.");

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports = { CreateProblem };