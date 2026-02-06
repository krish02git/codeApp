const Problem = require('../models/problem');
const User = require('../models/user');
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
            // console.log(submitResult);
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

const UpdateProblem = async (req,res)=>{
   const {id} =  req.params; //Dynamic Route
   const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, problemCreater, referenceSolution } = req.body;

   try {
        // id chec
        if(!id){
            return res.status(400).send("Missing Id field!");
        }
        const DsaProblem = await Problem.findById(id);
        if(!id){
            return res.status(400).send("Wrong Id!");
        }
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

        // update in DB!
        const newProblem = await Problem.findByIdAndUpdate(id, {
            ...req.body
        },{
            runValidators:true, //Check all validation in models/Problem.js
            new:true //new doc will be retured 
        });

        res.status(200).send("problem saved successfully.");

    }catch(err){
        res.status(500).send("Error : " + err.message);
   }
}

const DeleteProblem = async (req,res) =>{
   const {id} = req.params;
   try{
    if(!id) return res.status(400).send("Id Field Missing");
    const deletedProblem = await Problem.findByIdAndDelete(id);
    if(!deletedProblem){
        return res.status(404).send("Problem is missing !");
    }
    res.status(200).send("Deleted!");
   }catch(err){
        res.status(500).send("Error : " + err.message);
   }
}

const getProblemById = async (req,res)=>{
    const {id} = req.params;
    try{
        if(!id) return res.status(400).send("Id Field Missing");
        const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases referenceSolution');// Not every field 
        // select('-don't select')
        if(!getProblem){
            return res.status(404).send("Problem is missing !");
        }
        res.status(200).send(getProblem);
    }catch(err){
        res.status(500).send("Error : " + err.message);
    }
}

const getAllProblem = async (req,res)=>{

    try{
        // Pagination -> page=2&limit=10 -> skip=(page-1)*limit -> await Problem.find().skip(10).limit(10)
        // Filter : difficulty 
        const getProblem = await Problem.find({}).select('_id title difficulty tags');// all problem in DB -> more time -> Pagination Limited problems
        if(getProblem.length==0){
            return res.status(404).send("Problem is missing !");
        }
        res.status(200).send(getProblem);
    }catch(err){
        res.status(500).send("Error : " + err.message);
    }
}

const SolvedAllProblemByUser= async (req,res)=>{
    // when submit -> store : userId + problemId + code,language,time,memory,status->Err,complie,testcasePass,
    // run -> no need to store , only submit!
    try{
        const userId = req.result._id;
        const user = await User.findById(userId).populate("problemSolved").select("_id title difficulty tags");
        const count = user.problemSolved.length;
        res.status(200).send("Total solved problem : " + count + "\n" + user.problemSolved);
    }catch(err){
        res.status(500).send("Error : "+ err.message);
    }
}

// populate : ref='' used in Schema !

module.exports = { CreateProblem , UpdateProblem, DeleteProblem,getProblemById,SolvedAllProblemByUser, getAllProblem};