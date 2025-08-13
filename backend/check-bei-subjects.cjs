const mongoose = require('mongoose');
const Subject = require('./models/Subject');

mongoose.connect('mongodb+srv://079bct044manish:routine@routine.mrjj7ho.mongodb.net/bctroutine?retryWrites=true&w=majority&appName=routine').then(async () => {
  console.log('🎓 ALL BEI SUBJECTS (Semester 7 & 8)');
  console.log('===================================');
  
  const allBeiSubjects = await Subject.find({
    programId: '6867f6be5a23774ba0443293',
    semester: { $in: [7, 8] }
  }).sort({ semester: 1, code: 1 });
  
  console.log('SEMESTER 7 SUBJECTS:');
  const sem7 = allBeiSubjects.filter(s => s.semester === 7);
  
  console.log('  CORE SUBJECTS:');
  const sem7Core = sem7.filter(s => !s.code.startsWith('CT725') && !s.code.startsWith('EX725'));
  sem7Core.forEach((subject, index) => {
    console.log(`    ${index + 1}. ${subject.code} - ${subject.name}`);
  });
  
  console.log('  ELECTIVE SUBJECTS:');
  const sem7Electives = sem7.filter(s => s.code.startsWith('CT725') || s.code.startsWith('EX725'));
  sem7Electives.forEach((subject, index) => {
    console.log(`    ${index + 1}. ${subject.code} - ${subject.name}`);
  });
  
  console.log('\nSEMESTER 8 SUBJECTS:');
  const sem8 = allBeiSubjects.filter(s => s.semester === 8);
  
  console.log('  CORE SUBJECTS:');
  const sem8Core = sem8.filter(s => 
    !s.code.startsWith('CT765') && 
    !s.code.startsWith('CT785') && 
    !s.code.startsWith('EX765') && 
    !s.code.startsWith('EX785') && 
    !s.code.startsWith('EE785')
  );
  sem8Core.forEach((subject, index) => {
    console.log(`    ${index + 1}. ${subject.code} - ${subject.name}`);
  });
  
  console.log('  ELECTIVE SUBJECTS:');
  const sem8Electives = sem8.filter(s => 
    s.code.startsWith('CT765') || 
    s.code.startsWith('CT785') || 
    s.code.startsWith('EX765') || 
    s.code.startsWith('EX785') || 
    s.code.startsWith('EE785')
  );
  sem8Electives.forEach((subject, index) => {
    console.log(`    ${index + 1}. ${subject.code} - ${subject.name}`);
  });
  
  console.log('\nSUMMARY:');
  console.log(`  Semester 7: ${sem7Core.length} core + ${sem7Electives.length} elective = ${sem7.length} total`);
  console.log(`  Semester 8: ${sem8Core.length} core + ${sem8Electives.length} elective = ${sem8.length} total`);
  
  mongoose.connection.close();
}).catch(console.error);
