const axios = require('axios');// no need to convert json to js obj

const getLanguageById = (lang) => {
    const language = {
        "c++": "cpp",
        "java": "java",
        "javascript": "javascript",
        "python": "python",
        "c": "c",
        "go": "go",
        "rust": "rust"
    };
    return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
    try {
        // Execute all submissions in parallel
        const results = await Promise.all(
            submissions.map(async (submission) => {
                try {
                    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                        language: submission.language,
                        version: submission.version,
                        files: submission.files,
                        stdin: submission.stdin,
                        compile_timeout: submission.compile_timeout,
                        run_timeout: submission.run_timeout
                    });

                    return {
                        input: submission.stdin,
                        expected: submission.expected_output,
                        actual: response.data.run.stdout.trim(),// What the code ACTUALLY printed/outputted
                        passed: response.data.run.stdout.trim() === submission.expected_output.trim(),// Boolean: true if actual output matches expected output
                        stderr: response.data.run.stderr,
                        exitCode: response.data.run.code
                    };
                } catch (error) {
                    return {
                        input: submission.stdin,
                        expected: submission.expected_output,
                        actual: null,
                        passed: false,
                        error: error.message,
                        stderr: error.response?.data?.message || ''
                    };
                }
            })
        );

        return {
            success: true,
            totalTests: results.length,
            passedTests: results.filter(r => r.passed).length,
            failedTests: results.filter(r => !r.passed).length,
            allPassed: results.every(r => r.passed),
            results: results
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { getLanguageById, submitBatch };