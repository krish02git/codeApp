const mongoose = require('mongoose');

async function main() {
    // Connect to mongoose DB :-
    await mongoose.connect(process.env.MONGOOSE_DB_STRING);
}

module.exports = main;