const mongoose = require('mongoose');
const Subject = require('./models/Subject');
const ElectiveGroup = require('./models/ElectiveGroup');
const Program = require('./models/Program');
const AcademicCalendar = require('./models/AcademicCalendar');

// Connect to MongoDB
mongoose.connect('mongodb+srv://079bct044manish:routine@routine.mrjj7ho.mongodb.net/bctroutine?retryWrites=true&w=majority&appName=routine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const populateBCTElectivesExact = async () => {
  try {
    // Use the provided BCT program _id directly
    const bctProgram = { _id: new mongoose.Types.ObjectId('6866b1dcc39639d7a7c76cb8') };
    
    // Get the current academic year
    const currentAcademicYear = await AcademicCalendar.findOne({ isActive: true });
    if (!currentAcademicYear) {
      console.log('❌ No active academic year found');
      return;
    }
    
    console.log('🔍 Removing existing BCT elective groups...');
    
    // Remove existing BCT elective groups for clean start
    await ElectiveGroup.deleteMany({
      programId: bctProgram._id,
      semester: { $in: [7, 8] }
    });

    console.log('✅ Existing BCT elective groups removed');

    // Official BCT Elective Subjects as per IOE syllabus
    const bctElectiveSubjects = {
      // Elective I (7th Semester)
      elective1_sem7: [
        { code: 'CT751', name: 'Advanced Java Programming' },
        { code: 'CT752', name: 'Data Mining' },
        { code: 'CT753', name: 'Embedded Systems Design Using Arm Technology' },
        { code: 'CT754', name: 'Image Processing and Pattern Recognition' },
        { code: 'CT755', name: 'Web Technologies and Applications' },
        { code: 'CT756', name: 'Operating System' },
        { code: 'CT757', name: 'Radar Technology' },
        { code: 'CT758', name: 'Satellite Communication' },
        { code: 'CT759', name: 'Biomedical Instrumentation' },
        { code: 'CT760', name: 'Aeronautical Telecommunication' },
        { code: 'CT761', name: 'RF and Microwave Engineering' }
      ],
      
      // Elective II (8th Semester)
      elective2_sem8: [
        { code: 'CT851', name: 'Agile Software Development' },
        { code: 'CT852', name: 'Networking with IPv6' },
        { code: 'CT853', name: 'Advanced Computer Architecture' },
        { code: 'CT854', name: 'Big Data Technologies' },
        { code: 'CT855', name: 'Optical Fiber Communication System' },
        { code: 'CT856', name: 'Broadcast Engineering' },
        { code: 'CT857', name: 'Wireless Communication' },
        { code: 'CT858', name: 'Database Management Systems' }
      ],
      
      // Elective III (8th Semester)
      elective3_sem8: [
        { code: 'CT871', name: 'Multimedia System' },
        { code: 'CT872', name: 'Enterprise Application Design and Development' },
        { code: 'CT873', name: 'Geographical Information System (GIS)' },
        { code: 'CT874', name: 'Power Electronics' },
        { code: 'CT875', name: 'Remote Sensing' },
        { code: 'CT876', name: 'XML: Foundations, Techniques and Applications' },
        { code: 'CT877', name: 'Artificial Intelligence' },
        { code: 'CT878', name: 'Speech Processing' },
        { code: 'CT879', name: 'Telecommunication' }
      ]
    };

    console.log('📝 Creating BCT elective subjects...');

    // Create subjects first
    const createdSubjects = {};
    
    for (const [groupKey, subjects] of Object.entries(bctElectiveSubjects)) {
      const semester = groupKey.includes('sem7') ? 7 : 8;
      createdSubjects[groupKey] = [];
      
      for (const subjectData of subjects) {
        // Check if subject already exists
        let existingSubject = await Subject.findOne({
          code: subjectData.code,
          programId: bctProgram._id
        });

        if (!existingSubject) {
          // Create new subject
          const newSubject = new Subject({
            name: subjectData.name,
            code: subjectData.code,
            semester: semester,
            fullMarks: 100,
            passMarks: 32,
            creditHour: 3,
            subjectType: 'Theory',
            programId: bctProgram._id,
            academicYearId: currentAcademicYear._id,
            isElective: true
          });

          existingSubject = await newSubject.save();
          console.log(`  ✅ Created subject: ${subjectData.name} (${subjectData.code})`);
        } else {
          console.log(`  📋 Subject exists: ${subjectData.name} (${subjectData.code})`);
        }

        createdSubjects[groupKey].push(existingSubject);
      }
    }

    console.log('📝 Creating BCT elective groups...');

    // Create Elective I (7th Semester)
    const electiveGroup1Data = {
      name: 'Elective I',
      code: 'BCT-ELE-I-7',
      programId: bctProgram._id,
      semester: 7,
      electiveType: 'Major',
      academicYearId: currentAcademicYear._id,
      subjects: createdSubjects.elective1_sem7.map(subject => ({
        subjectId: subject._id,
        subjectCode: subject.code,
        subjectName: subject.name
      })),
      isActive: true
    };

    const electiveGroup1 = new ElectiveGroup(electiveGroup1Data);
    await electiveGroup1.save();
    console.log(`✅ Created ${electiveGroup1Data.name} with ${electiveGroup1Data.subjects.length} subjects`);

    // Create Elective II (8th Semester)
    const electiveGroup2Data = {
      name: 'Elective II',
      code: 'BCT-ELE-II-8',
      programId: bctProgram._id,
      semester: 8,
      electiveType: 'Major',
      academicYearId: currentAcademicYear._id,
      subjects: createdSubjects.elective2_sem8.map(subject => ({
        subjectId: subject._id,
        subjectCode: subject.code,
        subjectName: subject.name
      })),
      isActive: true
    };

    const electiveGroup2 = new ElectiveGroup(electiveGroup2Data);
    await electiveGroup2.save();
    console.log(`✅ Created ${electiveGroup2Data.name} with ${electiveGroup2Data.subjects.length} subjects`);

    // Create Elective III (8th Semester)
    const electiveGroup3Data = {
      name: 'Elective III',
      code: 'BCT-ELE-III-8',
      programId: bctProgram._id,
      semester: 8,
      electiveType: 'Major',
      academicYearId: currentAcademicYear._id,
      subjects: createdSubjects.elective3_sem8.map(subject => ({
        subjectId: subject._id,
        subjectCode: subject.code,
        subjectName: subject.name
      })),
      isActive: true
    };

    const electiveGroup3 = new ElectiveGroup(electiveGroup3Data);
    await electiveGroup3.save();
    console.log(`✅ Created ${electiveGroup3Data.name} with ${electiveGroup3Data.subjects.length} subjects`);

    // Verify creation
    const createdGroups = await ElectiveGroup.find({ programId: bctProgram._id })
      .populate('subjects.subjectId', 'name code semester');
    
    console.log('\n🎉 BCT Elective Groups Created Successfully!');
    console.log(`📊 Total Groups: ${createdGroups.length}`);
    
    createdGroups.forEach(group => {
      console.log(`\n📋 ${group.name} (Semester ${group.semester})`);
      console.log(`   Code: ${group.code}`);
      console.log(`   Type: ${group.electiveType}`);
      console.log(`   Subjects (${group.subjects.length}):`);
      group.subjects.forEach(s => {
        console.log(`     - ${s.subjectName} (${s.subjectCode})`);
      });
    });

    console.log('\n✅ BCT electives population completed successfully!');

  } catch (error) {
    console.error('❌ Error populating BCT electives:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

populateBCTElectivesExact();
