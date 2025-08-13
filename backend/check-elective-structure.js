const mongoose = require('mongoose');
require('./config/db');
const ElectiveGroup = require('./models/ElectiveGroup');

mongoose.connection.once('open', async () => {
  const groups = await ElectiveGroup.find().populate('subjects.subjectId', 'name code semester');
  console.log('Elective Groups Structure:');
  
  const byProgram = {};
  groups.forEach(group => {
    const key = group.programId + '-' + group.semester;
    if (!byProgram[key]) byProgram[key] = [];
    byProgram[key].push({
      name: group.name,
      type: group.electiveType,
      subjectCount: group.subjects.length
    });
  });
  
  for (const [key, groupList] of Object.entries(byProgram)) {
    const [program, semester] = key.split('-');
    console.log(`${program} Semester ${semester}: ${groupList.length} elective groups`);
    groupList.forEach((group, index) => {
      console.log(`  Group ${index + 1}: ${group.name} (${group.type}) - ${group.subjectCount} subjects`);
    });
  }
  
  process.exit(0);
});
