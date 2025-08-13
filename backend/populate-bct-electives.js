const mongoose = require('mongoose');
require('./config/db');

const ElectiveGroup = require('./models/ElectiveGroup');
const Subject = require('./models/Subject');
const Program = require('./models/Program');

async function populateBCTElectives() {
  try {
    console.log('🚀 Starting BCT Electives Population...');
    
    // Find BCT program
    const bctProgram = await Program.findOne({ code: 'BCT' });
    if (!bctProgram) {
      console.error('❌ BCT program not found!');
      return;
    }
    console.log(`✅ Found BCT Program: ${bctProgram.name}`);

    // Find all BCT subjects for semester 7 and 8
    const bctSubjects7 = await Subject.find({ 
      programId: bctProgram._id, 
      semester: 7 
    }).select('_id name code');
    
    const bctSubjects8 = await Subject.find({ 
      programId: bctProgram._id, 
      semester: 8 
    }).select('_id name code');

    console.log(`📚 Found ${bctSubjects7.length} subjects in BCT Semester 7`);
    console.log(`📚 Found ${bctSubjects8.length} subjects in BCT Semester 8`);

    // Define elective subjects for BCT
    const electiveSubjects = {
      7: [
        'Advanced Java Programming',
        'Data Mining',
        'Embedded Systems Design Using Arm Technology',
        'Image Processing and Pattern Recognition',
        'Web Technologies and Applications',
        'Operating System',
        'Radar Technology',
        'Satellite Communication',
        'Biomedical Instrumentation',
        'Aeronautical Telecommunication',
        'RF and Microwave Engineering'
      ],
      8: {
        'Elective II': [
          'Agile Software Development',
          'Networking with IPv6',
          'Advanced Computer Architecture',
          'Big Data Technologies',
          'Optical Fiber Communication System',
          'Broadcast Engineering',
          'Wireless Communication',
          'Database Management Systems'
        ],
        'Elective III': [
          'Multimedia System',
          'Enterprise Application Design and Development',
          'Geographical Information System (GIS)',
          'Power Electronics',
          'Remote Sensing',
          'XML: Foundations, Techniques and Applications',
          'Artificial Intelligence',
          'Speech Processing',
          'Telecommunication'
        ]
      }
    };

    // Function to find subject by name (case insensitive, partial match)
    function findSubjectByName(subjects, targetName) {
      return subjects.find(subject => {
        const subjectName = subject.name.toLowerCase();
        const target = targetName.toLowerCase();
        
        // Try exact match first
        if (subjectName === target) return true;
        
        // Try partial matches
        if (subjectName.includes(target) || target.includes(subjectName)) return true;
        
        // Try matching key words
        const subjectWords = subjectName.split(/\s+/);
        const targetWords = target.split(/\s+/);
        const matchCount = targetWords.filter(word => 
          subjectWords.some(sWord => sWord.includes(word) || word.includes(sWord))
        ).length;
        
        return matchCount >= Math.min(2, targetWords.length);
      });
    }

    // Clear existing BCT elective groups
    await ElectiveGroup.deleteMany({ programId: bctProgram._id });
    console.log('🗑️  Cleared existing BCT elective groups');

    // Create Elective I (7th Semester)
    console.log('\n📝 Creating BCT Elective I (7th Semester)...');
    const elective1Subjects = [];
    
    for (const electiveName of electiveSubjects[7]) {
      const foundSubject = findSubjectByName(bctSubjects7, electiveName);
      if (foundSubject) {
        elective1Subjects.push({ subjectId: foundSubject._id });
        console.log(`  ✅ Found: ${foundSubject.name} (${foundSubject.code})`);
      } else {
        console.log(`  ❌ Not found: ${electiveName}`);
      }
    }

    if (elective1Subjects.length > 0) {
      const electiveGroup1 = new ElectiveGroup({
        name: 'Elective I',
        programId: bctProgram._id,
        semester: 7,
        electiveType: 'Major',
        subjects: elective1Subjects,
        isActive: true
      });
      
      await electiveGroup1.save();
      console.log(`✅ Created Elective I with ${elective1Subjects.length} subjects`);
    }

    // Create Elective II (8th Semester)
    console.log('\n📝 Creating BCT Elective II (8th Semester)...');
    const elective2Subjects = [];
    
    for (const electiveName of electiveSubjects[8]['Elective II']) {
      const foundSubject = findSubjectByName(bctSubjects8, electiveName);
      if (foundSubject) {
        elective2Subjects.push({ subjectId: foundSubject._id });
        console.log(`  ✅ Found: ${foundSubject.name} (${foundSubject.code})`);
      } else {
        console.log(`  ❌ Not found: ${electiveName}`);
      }
    }

    if (elective2Subjects.length > 0) {
      const electiveGroup2 = new ElectiveGroup({
        name: 'Elective II',
        programId: bctProgram._id,
        semester: 8,
        electiveType: 'Major',
        subjects: elective2Subjects,
        isActive: true
      });
      
      await electiveGroup2.save();
      console.log(`✅ Created Elective II with ${elective2Subjects.length} subjects`);
    }

    // Create Elective III (8th Semester)
    console.log('\n📝 Creating BCT Elective III (8th Semester)...');
    const elective3Subjects = [];
    
    for (const electiveName of electiveSubjects[8]['Elective III']) {
      const foundSubject = findSubjectByName(bctSubjects8, electiveName);
      if (foundSubject) {
        elective3Subjects.push({ subjectId: foundSubject._id });
        console.log(`  ✅ Found: ${foundSubject.name} (${foundSubject.code})`);
      } else {
        console.log(`  ❌ Not found: ${electiveName}`);
      }
    }

    if (elective3Subjects.length > 0) {
      const electiveGroup3 = new ElectiveGroup({
        name: 'Elective III',
        programId: bctProgram._id,
        semester: 8,
        electiveType: 'Major',
        subjects: elective3Subjects,
        isActive: true
      });
      
      await electiveGroup3.save();
      console.log(`✅ Created Elective III with ${elective3Subjects.length} subjects`);
    }

    // Verify creation
    const createdGroups = await ElectiveGroup.find({ programId: bctProgram._id })
      .populate('subjects.subjectId', 'name code semester');
    
    console.log('\n🎉 BCT Elective Groups Created Successfully!');
    console.log(`📊 Total Groups: ${createdGroups.length}`);
    
    createdGroups.forEach(group => {
      console.log(`\n📋 ${group.name} (Semester ${group.semester})`);
      console.log(`   Type: ${group.electiveType}`);
      console.log(`   Subjects (${group.subjects.length}):`);
      group.subjects.forEach(s => {
        console.log(`     - ${s.subjectId.name} (${s.subjectId.code})`);
      });
    });

  } catch (error) {
    console.error('❌ Error populating BCT electives:', error);
  } finally {
    process.exit(0);
  }
}

// Connect to database and run
mongoose.connection.once('open', () => {
  console.log('📡 Connected to MongoDB');
  populateBCTElectives();
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});
