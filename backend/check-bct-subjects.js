const mongoose = require('mongoose');
const Subject = require('./models/Subject');
const Program = require('./models/Program');

mongoose.connect('mongodb+srv://079bct044manish:routine@routine.mrjj7ho.mongodb.net/bctroutine?retryWrites=true&w=majority&appName=routine').then(async () => {
  console.log('🎓 BCT SUBJECTS (Semester 7 & 8)');
  console.log('=================================');
  
  // Find BCT program
  const bctProgram = await Program.findOne({ code: 'BCT' });
  
  if (!bctProgram) {
    console.log('BCT program not found');
    mongoose.connection.close();
    return;
  }
  
  console.log(`BCT Program ID: ${bctProgram._id}`);
  
  const allBctSubjects = await Subject.find({
    programId: bctProgram._id,
    semester: { $in: [7, 8] }
  }).sort({ semester: 1, code: 1 });
  
  console.log('\nSEMESTER 7 SUBJECTS:');
  const sem7 = allBctSubjects.filter(s => s.semester === 7);
  sem7.forEach((subject, index) => {
    console.log(`  ${index + 1}. ${subject.code} - ${subject.name}`);
  });
  
  console.log('\nSEMESTER 8 SUBJECTS:');
  const sem8 = allBctSubjects.filter(s => s.semester === 8);
  sem8.forEach((subject, index) => {
    console.log(`  ${index + 1}. ${subject.code} - ${subject.name}`);
  });
  
  console.log(`\nTOTAL: Semester 7: ${sem7.length}, Semester 8: ${sem8.length}`);
  
  mongoose.connection.close();
}).catch(console.error);
