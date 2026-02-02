
const CreateProblem = async (req, res) => {
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, problemCreater, referenceSolution } = req.body;
    try{
        for(const {language,initialCode} of referenceSolution){
            
        }
    }catch(err){
        res.status(400).send("Error : " + err.message);
    }
}