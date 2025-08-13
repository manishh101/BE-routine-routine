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
    
    // Get the current academic year (you may need to adjust this)
    const currentAcademicYear = await AcademicCalendar.findOne({ isActive: true });
    if (!currentAcademicYear) {
      console.error('❌ No active academic year found');
      return;
    }

    console.log('🔍 Removing existing BCT elective groups...');
    
    // Remove existing BCT elective groups for clean start
    await ElectiveGroup.deleteMany({
      programId: bctProgram._id
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

    // Define BCT Elective Subjects for 7th and 8th Semester
    const bctElectiveSubjects = {
      // 7th Semester - Elective I
      7: [
        {
          name: 'Advanced Java Programming',
          code: 'CT759',
          creditHour: 3,
          type: 'theory',
          isElective: true
        },
        {
          name: 'Data Mining',
          code: 'CT760',
          creditHour: 3,
          type: 'theory',
          isElective: true
        },
        {
          name: 'Embedded Systems Design Using Arm Technology',
          code: 'CT761',
          creditHour: 3,
          type: 'theory',
          isElective: true
        },
        {
          name: 'Image Processing and Pattern Recognition',
          code: 'CT762',
          creditHour: 3,
          type: 'theory',
          isElective: true
        },
        {
          name: 'Web Technologies and Applications',
          code: 'CT763',
          creditHour: 3,
          type: 'theory',
          isElective: true
        },
        {
          name: 'Operating System',
          code: 'CT764',
          creditHour: 3,
          type: 'theory',
          isElective: true
        },
        {
          name: 'Radar Technology',
          code: 'EX759',
          creditHour: 3,
          type: 'theory',
          isElective: true
        },
        {
          name: 'Satellite Communication',
          code: 'EX760',
          creditHour: 3,
          type: 'theory',
          isElective: true
        },
        {
          name: 'Biomedical Instrumentation',
          code: 'EX761',
          creditHour: 3,
          type: 'theory',
          isElective: true
        },
        {
          name: 'Aeronautical Telecommunication',
          code: 'EX762',
          creditHour: 3,
          type: 'theory',
          isElective: true
        },
        {
          name: 'RF and Microwave Engineering',
          code: 'EX763',
          creditHour: 3,
          type: 'theory',
          isElective: true
        }
      ],
      // 8th Semester - Elective II & III
      8: {
        electiveII: [
          {
            name: 'Agile Software Development',
            code: 'CT801',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Networking with IPv6',
            code: 'CT802',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Advanced Computer Architecture',
            code: 'CT803',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Big Data Technologies',
            code: 'CT804',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Optical Fiber Communication System',
            code: 'EX801',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Broadcast Engineering',
            code: 'EX802',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Wireless Communication',
            code: 'EX803',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Database Management Systems',
            code: 'CT805',
            creditHour: 3,
            type: 'theory',
            isElective: true
          }
        ],
        electiveIII: [
          {
            name: 'Multimedia System',
            code: 'CT821',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Enterprise Application Design and Development',
            code: 'CT822',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Geographical Information System (GIS)',
            code: 'CT823',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Power Electronics',
            code: 'EE821',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Remote Sensing',
            code: 'CT824',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'XML: Foundations, Techniques and Applications',
            code: 'CT825',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Artificial Intelligence',
            code: 'CT826',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Speech Processing',
            code: 'EX821',
            creditHour: 3,
            type: 'theory',
            isElective: true
          },
          {
            name: 'Telecommunication',
            code: 'EX822',
            creditHour: 3,
            type: 'theory',
            isElective: true
          }
        ]
      }
    };

    console.log('📝 Creating BCT elective subjects...');

    const createdSubjects = {};

    // Create 7th semester electives
    console.log('Creating 7th semester electives...');
    const semester7Subjects = [];
    for (const subjectData of bctElectiveSubjects[7]) {
      const subject = new Subject({
        ...subjectData,
        semester: 7,
        programId: bctProgram._id,
        academicYear: currentAcademicYear._id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const savedSubject = await subject.save();
      semester7Subjects.push(savedSubject);
      console.log(`✅ Created: ${savedSubject.name} (${savedSubject.code})`);
    }

    // Create 8th semester electives (Elective II)
    console.log('Creating 8th semester Elective II subjects...');
    const electiveIISubjects = [];
    for (const subjectData of bctElectiveSubjects[8].electiveII) {
      const subject = new Subject({
        ...subjectData,
        semester: 8,
        programId: bctProgram._id,
        academicYear: currentAcademicYear._id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const savedSubject = await subject.save();
      electiveIISubjects.push(savedSubject);
      console.log(`✅ Created: ${savedSubject.name} (${savedSubject.code})`);
    }

    // Create 8th semester electives (Elective III)
    console.log('Creating 8th semester Elective III subjects...');
    const electiveIIISubjects = [];
    for (const subjectData of bctElectiveSubjects[8].electiveIII) {
      const subject = new Subject({
        ...subjectData,
        semester: 8,
        programId: bctProgram._id,
        academicYear: currentAcademicYear._id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const savedSubject = await subject.save();
      electiveIIISubjects.push(savedSubject);
      console.log(`✅ Created: ${savedSubject.name} (${savedSubject.code})`);
    }

    console.log('📋 Creating elective groups...');

    // Create BCT Elective Groups
    const bctElectiveGroups = [
      // Semester 7 - Elective I Group
      {
        programId: bctProgram._id,
        academicYearId: currentAcademicYear._id,
        name: "7th Semester Elective I (BCT)",
        code: "BCT-7-ELEC-I",
        semester: 7,
        subjects: semester7Subjects.map(subject => ({
          subjectId: subject._id,
          subjectCode: subject.code,
          subjectName: subject.name,
          maxSections: 2,
          isAvailable: true
        })),
        rules: {
          minRequired: 1,
          maxAllowed: 1,
          isMandatory: true
        },
        isActive: true,
        description: "4th Year, 1st Part - Choose one elective from the available options"
      },

      // Semester 8 - Elective II Group
      {
        programId: bctProgram._id,
        academicYearId: currentAcademicYear,
        name: "8th Semester Elective II (BCT)",
        code: "BCT-8-ELEC-II",
        semester: 8,
        subjects: electiveIISubjects.map(subject => ({
          subjectId: subject._id,
          subjectCode: subject.code,
          subjectName: subject.name,
          maxSections: 2,
          isAvailable: true
        })),
        rules: {
          minRequired: 1,
          maxAllowed: 1,
          isMandatory: true
        },
        isActive: true,
        description: "4th Year, 2nd Part - Choose one elective from the available options"
      },

      // Semester 8 - Elective III Group
      {
        programId: bctProgram._id,
        academicYearId: currentAcademicYear,
        name: "8th Semester Elective III (BCT)",
        code: "BCT-8-ELEC-III",
        semester: 8,
        subjects: electiveIIISubjects.map(subject => ({
          subjectId: subject._id,
          subjectCode: subject.code,
          subjectName: subject.name,
          maxSections: 2,
          isAvailable: true
        })),
        rules: {
          minRequired: 1,
          maxAllowed: 1,
          isMandatory: true
        },
        isActive: true,
        description: "4th Year, 2nd Part - Choose one elective from the available options"
      }
    ];

    // Create elective groups
    for (const groupData of bctElectiveGroups) {
      try {
        const electiveGroup = new ElectiveGroup(groupData);
        await electiveGroup.save();
        console.log(`✅ Created elective group: ${electiveGroup.name} (${electiveGroup.subjects.length} subjects)`);
      } catch (error) {
        console.error(`❌ Error creating elective group ${groupData.name}:`, error.message);
      }
    }

    await electiveGroup3.save();
    console.log(`✅ Created Elective Group III with ${electiveIIISubjects.length} subjects`);

    // Verify the creation
    const verificationGroups = await ElectiveGroup.find({ programId: bctProgram._id })
      .populate('subjects.subjectId', 'name code semester');

    console.log('\n🎉 BCT Elective Groups Created Successfully!');
    console.log(`📊 Total Groups: ${verificationGroups.length}`);
    
    verificationGroups.forEach(group => {
      console.log(`\n📋 ${group.name} (Semester ${group.semester})`);
      console.log(`   Type: ${group.electiveType}`);
      console.log(`   Subjects (${group.subjects.length}):`);
      group.subjects.forEach(s => {
        console.log(`     - ${s.subjectId.name} (${s.subjectId.code})`);
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
