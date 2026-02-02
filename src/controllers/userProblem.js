const {getLanguageById,submitBatch} =  require('../utils/ProblemUtility');

const CreateProblem = async (req, res) => {
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, problemCreater, referenceSolution } = req.body;
    try {
        for (const { language, initialCode } of referenceSolution) {
            const pistonLanguage = getLanguageById(language); //not id

            const submissions = visibleTestCases.map((testCase) => ({
                language: pistonLanguage,
                version: '*',
                files: [{
                    content: initialCode //source code!
                }],
                stdin: testCase.input,
                compile_timeout: 10000,  // : 10 seconds
                run_timeout: 3000,       // : 3 seconds
                expected_output: testCase.output  // Keep for your comparison
            }));

            const submitResult = await submitBatch(submissions);
        }
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
}