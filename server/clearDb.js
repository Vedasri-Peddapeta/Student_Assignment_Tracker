const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Assignment = require('./models/Assignment');

dotenv.config();

const clearDatabase = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/student_assignment_tracker';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected.');

    console.log('Clearing all users...');
    const usersDeleted = await User.deleteMany({});
    console.log(`Deleted ${usersDeleted.deletedCount} users.`);

    console.log('Clearing all assignments...');
    const assignmentsDeleted = await Assignment.deleteMany({});
    console.log(`Deleted ${assignmentsDeleted.deletedCount} assignments.`);

    console.log('\n✨ Database successfully cleared and reset!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
