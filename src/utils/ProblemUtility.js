const axios = require('axios');

const getLanguageById = (lang) => {
    const language = {
        "c++": "cpp",
        "cpp": "cpp",      // ADD THIS
        "java": "java",
        "javascript": "javascript",
        "js": "javascript",  // ADD THIS
        "python": "python",
        "py": "python",      // ADD THIS
        "c": "c",
        "go": "go",
        "rust": "rust"
    };
    
    const result = language[lang.toLowerCase()];
    
    if (!result) {
        throw new Error(`Unsupported language: ${lang}. Supported: ${Object.keys(language).join(', ')}`);
    }
    
    return result;
};

const getFileName = (lang) => {
    const fileNames = {
        "cpp": "main.cpp",
        "java": "Main.java",
        "javascript": "main.js",
        "python": "main.py",
        "c": "main.c",
        "go": "main.go",
        "rust": "main.rs"
    };
    return fileNames[lang] || "main.txt";
};

// ADD DELAY FUNCTION
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const submitBatch = async (submissions) => {
    try {
        const results = [];
        
        // Execute submissions SEQUENTIALLY with delay (not parallel)
        for (const submission of submissions) {
            try {
                const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                    language: submission.language,
                    version: submission.version,
                    files: submission.files,
                    stdin: submission.stdin,
                    compile_timeout: submission.compile_timeout,
                    run_timeout: submission.run_timeout
                });

                // Normalize output: remove all whitespace for comparison
                const actualOutput = response.data.run.stdout.trim().replace(/\s/g, '');
                const expectedOutput = submission.expected_output.trim().replace(/\s/g, '');

                results.push({
                    input: submission.stdin,
                    expected: submission.expected_output,
                    actual: response.data.run.stdout.trim(),
                    passed: actualOutput === expectedOutput,
                    stderr: response.data.run.stderr,
                    exitCode: response.data.run.code
                });

                // Wait 250ms between requests to avoid rate limiting
                await delay(250);
                
            } catch (error) {
                results.push({
                    input: submission.stdin,
                    expected: submission.expected_output,
                    actual: null,
                    passed: false,
                    error: error.message,
                    stderr: error.response?.data?.message || error.message
                });
                
                // Still wait even on error
                await delay(250);
            }
        }

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

module.exports = { getLanguageById, getFileName, submitBatch };