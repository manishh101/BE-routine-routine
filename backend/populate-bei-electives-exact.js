const mongoose = require('mongoose');
const Subject = require('./models/Subject');
const ElectiveGroup = require('./models/ElectiveGroup');
const Program = require('./models/Program');

// Connect to MongoDB
mongoose.connect('mongodb+srv://079bct044manish:routine@routine.mrjj7ho.mongodb.net/bctroutine?retryWrites=true&w=majority&appName=routine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const populateBEIElectivesExact = async () => {
  try {
    // Use the provided BEI program _id directly
    const beiProgram = { _id: new mongoose.Types.ObjectId('6867f6be5a23774ba0443293') };
    
    console.log('🔍 Removing existing BEI elective subjects...');
    
    // Remove existing BEI elective subjects for clean start
    await Subject.deleteMany({
      programId: { $in: [beiProgram._id] },
      semester: { $in: [7, 8] },
      $or: [
        { code: /^CT725/ },
        { code: /^CT765/ },
        { code: /^CT785/ },
        { code: /^EX725/ },
        { code: /^EX765/ },
        { code: /^EX785/ },
        { code: /^EE785/ }
      ]
    });

    console.log('✅ Existing BEI elective subjects removed');

    // Official BEI Elective Subjects as per IOE syllabus
    const beiElectiveSubjects = [
      // ==========================================
      // SEMESTER 7 - ELECTIVE I (4th Year, 1st Part)
      // ==========================================
      {
        programId: [beiProgram._id],
        code: "CT725-01",
        name: "Data Mining and Warehousing",
        description: "Techniques for extracting knowledge from large datasets and data warehouse design.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 7,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT725-02",
        name: "Web Development/Technology",
        description: "Modern web development technologies and frameworks.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 7,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT725-03",
        name: "Advanced Java Programming",
        description: "Advanced concepts in Java programming including enterprise applications.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 7,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX725-01",
        name: "Avionics",
        description: "Electronic systems used in aircraft, satellites, and spacecraft.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 7,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX725-02",
        name: "Image Processing and Pattern Recognition",
        description: "Digital image processing techniques and pattern recognition algorithms.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 7,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX725-03",
        name: "Radar",
        description: "Radar system principles, design, and applications.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 7,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX725-04",
        name: "Biomedical Instrumentation",
        description: "Medical devices and instrumentation for biomedical applications.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 7,
        isActive: true
      },

      // ==========================================
      // SEMESTER 8 - ELECTIVE II (4th Year, 2nd Part)
      // ==========================================
      {
        programId: [beiProgram._id],
        code: "CT765-02",
        name: "Agile Software Development",
        description: "Agile methodologies and practices for software development.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT765-03",
        name: "Networking with IPv6",
        description: "Advanced networking concepts with IPv6 protocol.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT765-04",
        name: "Advanced Computer Architecture",
        description: "Modern computer architecture and parallel processing systems.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT765-07",
        name: "Big Data Technologies",
        description: "Big data processing frameworks and analytics technologies.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT765-01",
        name: "Optical Fiber Communication System",
        description: "Fiber optic communication systems and optical networking.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX765-03",
        name: "Broadcast Engineering",
        description: "Broadcasting systems and transmission technologies.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX765-04",
        name: "Wireless Communication",
        description: "Wireless communication systems and mobile technologies.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX765-06",
        name: "Database Management System",
        description: "Advanced database systems and data management techniques.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },

      // ==========================================
      // SEMESTER 8 - ELECTIVE III (Also in 8th Semester)
      // ==========================================
      {
        programId: [beiProgram._id],
        code: "CT785-03",
        name: "Multimedia System",
        description: "Multimedia processing and communication systems.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT785-04",
        name: "Enterprise Application Design and Development",
        description: "Large-scale enterprise application architecture and development.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT785-07",
        name: "Geographical Information System",
        description: "GIS principles, applications, and spatial data analysis.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EE785-07",
        name: "Power Electronics",
        description: "Power semiconductor devices and power electronic circuits.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT785-01",
        name: "Remote Sensing",
        description: "Remote sensing principles, sensors, and applications.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT785-05",
        name: "XML: Foundations, Techniques and Applications",
        description: "XML technologies, web services, and document processing.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT785-06",
        name: "Artificial Intelligence",
        description: "AI principles, machine learning, and intelligent systems.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT785-08",
        name: "Speech Processing",
        description: "Digital speech processing and recognition systems.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX785-03",
        name: "Telecommunication",
        description: "Telecommunication systems and network technologies.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      }
    ];

    // Insert the BEI elective subjects
    console.log('📚 Creating BEI elective subjects...');
    for (const subjectData of beiElectiveSubjects) {
      try {
        const subject = new Subject(subjectData);
        await subject.save();
        console.log(`✅ Created subject: ${subject.code} - ${subject.name} (Semester ${subject.semester})`);
      } catch (error) {
        console.error(`❌ Error creating subject ${subjectData.code}:`, error.message);
      }
    }

    // Remove existing BEI elective groups
    console.log('\n🗑️ Removing existing BEI elective groups...');
    await ElectiveGroup.deleteMany({
      programId: beiProgram._id,
      semester: { $in: [7, 8] }
    });

    // Get current academic year (using a default for now)
    const currentAcademicYear = new mongoose.Types.ObjectId('64f8b2c1c5a6b8c9d0e1f2a3'); // You may need to adjust this

    // Create BEI Elective Groups exactly as per IOE syllabus
    const beiElectiveGroups = [
      // Semester 7 - Elective I Group
      {
        programId: beiProgram._id,
        academicYearId: currentAcademicYear,
        name: "7th Semester Elective I (BEI)",
        code: "BEI-7-ELEC-I",
        semester: 7,
        subjects: [
          { subjectCode: "CT725-01", subjectName: "Data Mining and Warehousing", maxSections: 2, isAvailable: true },
          { subjectCode: "CT725-02", subjectName: "Web Development/Technology", maxSections: 2, isAvailable: true },
          { subjectCode: "CT725-03", subjectName: "Advanced Java Programming", maxSections: 2, isAvailable: true },
          { subjectCode: "EX725-01", subjectName: "Avionics", maxSections: 2, isAvailable: true },
          { subjectCode: "EX725-02", subjectName: "Image Processing and Pattern Recognition", maxSections: 2, isAvailable: true },
          { subjectCode: "EX725-03", subjectName: "Radar", maxSections: 2, isAvailable: true },
          { subjectCode: "EX725-04", subjectName: "Biomedical Instrumentation", maxSections: 2, isAvailable: true }
        ],
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
        programId: beiProgram._id,
        academicYearId: currentAcademicYear,
        name: "8th Semester Elective II (BEI)",
        code: "BEI-8-ELEC-II",
        semester: 8,
        subjects: [
          { subjectCode: "CT765-02", subjectName: "Agile Software Development", maxSections: 2, isAvailable: true },
          { subjectCode: "CT765-03", subjectName: "Networking with IPv6", maxSections: 2, isAvailable: true },
          { subjectCode: "CT765-04", subjectName: "Advanced Computer Architecture", maxSections: 2, isAvailable: true },
          { subjectCode: "CT765-07", subjectName: "Big Data Technologies", maxSections: 2, isAvailable: true },
          { subjectCode: "CT765-01", subjectName: "Optical Fiber Communication System", maxSections: 2, isAvailable: true },
          { subjectCode: "EX765-03", subjectName: "Broadcast Engineering", maxSections: 2, isAvailable: true },
          { subjectCode: "EX765-04", subjectName: "Wireless Communication", maxSections: 2, isAvailable: true },
          { subjectCode: "EX765-06", subjectName: "Database Management System", maxSections: 2, isAvailable: true }
        ],
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
        programId: beiProgram._id,
        academicYearId: currentAcademicYear,
        name: "8th Semester Elective III (BEI)",
        code: "BEI-8-ELEC-III",
        semester: 8,
        subjects: [
          { subjectCode: "CT785-03", subjectName: "Multimedia System", maxSections: 2, isAvailable: true },
          { subjectCode: "CT785-04", subjectName: "Enterprise Application Design and Development", maxSections: 2, isAvailable: true },
          { subjectCode: "CT785-07", subjectName: "Geographical Information System", maxSections: 2, isAvailable: true },
          { subjectCode: "EE785-07", subjectName: "Power Electronics", maxSections: 2, isAvailable: true },
          { subjectCode: "CT785-01", subjectName: "Remote Sensing", maxSections: 2, isAvailable: true },
          { subjectCode: "CT785-05", subjectName: "XML: Foundations, Techniques and Applications", maxSections: 2, isAvailable: true },
          { subjectCode: "CT785-06", subjectName: "Artificial Intelligence", maxSections: 2, isAvailable: true },
          { subjectCode: "CT785-08", subjectName: "Speech Processing", maxSections: 2, isAvailable: true },
          { subjectCode: "EX785-03", subjectName: "Telecommunication", maxSections: 2, isAvailable: true }
        ],
        rules: {
          minRequired: 1,
          maxAllowed: 1,
          isMandatory: true
        },
        isActive: true,
        description: "4th Year, 2nd Part - Choose one additional elective from the available options"
      }
    ];

    // Create elective groups and populate with subject IDs
    console.log('\n🎯 Creating BEI elective groups...');
    for (const groupData of beiElectiveGroups) {
      try {
        // Find subject IDs for the group
        const subjectsWithIds = [];
        for (const subjectInfo of groupData.subjects) {
          const subject = await Subject.findOne({ code: subjectInfo.subjectCode, programId: beiProgram._id });
          if (subject) {
            subjectsWithIds.push({
              subjectId: subject._id,
              subjectCode: subject.code,
              subjectName: subject.name,
              maxSections: subjectInfo.maxSections,
              currentSelections: 0,
              isAvailable: subjectInfo.isAvailable,
              credits: subject.credits,
              weeklyHours: subject.weeklyHours,
              requiresLab: subject.requiresLab
            });
          } else {
            console.warn(`⚠️ Subject not found: ${subjectInfo.subjectCode}`);
          }
        }

        const electiveGroup = new ElectiveGroup({
          ...groupData,
          subjects: subjectsWithIds
        });

        await electiveGroup.save();
        console.log(`✅ Created elective group: ${electiveGroup.name} (${electiveGroup.subjects.length} subjects)`);
      } catch (error) {
        console.error(`❌ Error creating elective group ${groupData.name}:`, error.message);
      }
    }

    console.log('\n🎉 BEI elective subjects and groups populated successfully!');
    
    // Summary
    const totalElectiveSubjects = await Subject.countDocuments({
      programId: { $in: [beiProgram._id] },
      semester: { $in: [7, 8] },
      $or: [
        { code: /^CT725/ },
        { code: /^CT765/ },
        { code: /^CT785/ },
        { code: /^EX725/ },
        { code: /^EX765/ },
        { code: /^EX785/ },
        { code: /^EE785/ }
      ]
    });

    const totalElectiveGroups = await ElectiveGroup.countDocuments({
      programId: beiProgram._id,
      semester: { $in: [7, 8] }
    });

    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total BEI elective subjects created: ${totalElectiveSubjects}`);
    console.log(`   Total BEI elective groups created: ${totalElectiveGroups}`);
    console.log(`   Semester 7 - Elective I: 7 subjects`);
    console.log(`   Semester 8 - Elective II: 8 subjects`);
    console.log(`   Semester 8 - Elective III: 9 subjects`);
    console.log(`\n🎓 BEI elective system is now complete and ready for use!`);

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error populating BEI electives:', error);
    mongoose.connection.close();
  }
};

populateBEIElectivesExact();
