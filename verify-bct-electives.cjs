const mongoose = require('mongoose');
require('./backend/config/db');

const ElectiveGroup = require('./backend/models/ElectiveGroup');
const Program = require('./backend/models/Program');

setTimeout(async () => {
  try {
    // Find BCT program
    const bctProgram = await Program.findOne({ code: 'BCT' });
    if (!bctProgram) {
      console.log('❌ BCT program not found!');
      process.exit(1);
    }

    // Find BCT elective groups
    const bctElectives = await ElectiveGroup.find({ programId: bctProgram._id })
      .populate('subjects.subjectId', 'name code semester');

    console.log(`\n📊 BCT Elective Groups: ${bctElectives.length}`);
    
    if (bctElectives.length === 0) {
      console.log('❌ No BCT elective groups found');
    } else {
      bctElectives.forEach(group => {
        console.log(`\n📋 ${group.name} (Semester ${group.semester})`);
        console.log(`   Code: ${group.code}`);
        console.log(`   Type: ${group.electiveType}`);
        console.log(`   Subjects (${group.subjects.length}):`);
        group.subjects.forEach(s => {
          console.log(`     - ${s.subjectName} (${s.subjectCode})`);
        });
      });
      console.log('\n✅ BCT electives are available!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}, 2000);
