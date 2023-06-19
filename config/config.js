const mongoose = require('mongoose');


//mongodb connection file
async function connectDB() {
    try {
        await mongoose.connect('mongodb://0.0.0.0:27017/adminPanel', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected!');
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        process.exit(1);
    }
}


module.exports = connectDB;