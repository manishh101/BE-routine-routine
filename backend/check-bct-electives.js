const mongoose = require('mongoose');
const Subject = require('./models/Subject');
const Program = require('./models/Program');

mongoose.connect('mongodb+srv://079bct044manish:routine@routine.mrjj7ho.mongodb.net/bctroutine?retryWrites=true&w=majority&appName=routine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  try {
    // Get BCT program
    const bctProgram = await Program.findOne({ code: 'BCT' });
    if (!bctProgram) {
      console.log('BCT program not found');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Found BCT program: ${bctProgram.name} (ID: ${bctProgram._id})`);
    
    // Find elective subjects for BCT
    console.log('\n=== BCT ELECTIVE SUBJECTS ===');
    const bctElectives = await Subject.find({
      programId: { $in: [bctProgram._id] },
      $or: [
        { name: { $regex: /elective/i } },
        { code: { $regex: /elec/i } },
        { description: { $regex: /elective/i } }
      ]
    }).sort({ semester: 1, code: 1 });
    
    console.log(`Found ${bctElectives.length} BCT elective subjects:`);
    bctElectives.forEach(sub => {
      console.log(`Sem ${sub.semester}: ${sub.code} - ${sub.name}`);
    });
    
    // Also check subjects in semester 5-8 that might be electives
    console.log('\n=== BCT SUBJECTS IN SEMESTERS 5-8 ===');
    const lateSemesterSubjects = await Subject.find({
      programId: { $in: [bctProgram._id] },
      semester: { $in: [5, 6, 7, 8] }
    }).sort({ semester: 1, code: 1 });
    
    console.log(`Found ${lateSemesterSubjects.length} subjects in semesters 5-8:`);
    lateSemesterSubjects.forEach(sub => {
      console.log(`Sem ${sub.semester}: ${sub.code} - ${sub.name}`);
    });
    
    // Check all BCT subjects
    console.log('\n=== ALL BCT SUBJECTS BY SEMESTER ===');
    const allBctSubjects = await Subject.find({
      programId: { $in: [bctProgram._id] }
    }).sort({ semester: 1, code: 1 });
    
    console.log(`Total BCT subjects: ${allBctSubjects.length}`);
    for (let sem = 1; sem <= 8; sem++) {
      const semSubjects = allBctSubjects.filter(s => s.semester === sem);
      console.log(`\nSemester ${sem} (${semSubjects.length} subjects):`);
      semSubjects.forEach(sub => {
        console.log(`  ${sub.code} - ${sub.name}`);
      });
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
});
