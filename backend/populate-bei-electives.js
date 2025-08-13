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

const populateBEIElectives = async () => {
  try {
    // Use the provided BEI program _id directly
    const beiProgram = { _id: new mongoose.Types.ObjectId('6867f6be5a23774ba0443293') };
    
    // Get the current academic year (you may need to adjust this)
    const currentAcademicYear = await AcademicCalendar.findOne({ isActive: true });
    if (!currentAcademicYear) {
      console.log('No active academic year found. Creating a default one...');
      // You may need to create an academic year first
      throw new Error('Please create an active academic year first');
    }

    // Define BEI Elective Subjects for 7th and 8th Semester
  const beiElectiveSubjects = [
    // SEMESTER 5 ELECTIVES (Technical Electives Group A)
    {
      programId: [beiProgram._id],
      code: "EX525001",
      name: "Advanced Electronics Circuit Design",
      description: "Advanced analog and digital circuit design techniques and optimization.",
      credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      requiresLab: false,
      defaultLabGroups: 2,
      preferredRoomTypes: ["Lecture Hall"],
      defaultClassType: "L",
      semester: 5,
      isActive: true
    },
    {
      programId: [beiProgram._id],
      code: "EX525002",
      name: "Power Electronics",
      description: "Power semiconductor devices, converters, and their applications.",
      credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      requiresLab: false,
      defaultLabGroups: 2,
      preferredRoomTypes: ["Lecture Hall"],
      defaultClassType: "L",
      semester: 5,
      isActive: true
    },
    {
      programId: [beiProgram._id],
      code: "EX525003",
      name: "Biomedical Instrumentation",
      description: "Medical instrumentation, biosensors, and healthcare electronics.",
      credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      requiresLab: false,
      defaultLabGroups: 2,
      preferredRoomTypes: ["Lecture Hall"],
      defaultClassType: "L",
      semester: 5,
      isActive: true
    },
    {
      programId: [beiProgram._id],
      code: "EX525004",
      name: "Renewable Energy Systems",
      description: "Solar, wind, and other renewable energy conversion systems.",
      credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      requiresLab: false,
      defaultLabGroups: 2,
      preferredRoomTypes: ["Lecture Hall"],
      defaultClassType: "L",
      semester: 5,
      isActive: true
    },
    {
      programId: [beiProgram._id],
      code: "EX525005",
      name: "Image Processing and Computer Vision",
      description: "Digital image processing techniques and computer vision applications.",
      credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      requiresLab: false,
      defaultLabGroups: 2,
      preferredRoomTypes: ["Lecture Hall"],
      defaultClassType: "L",
      semester: 5,
      isActive: true
    },

    // SEMESTER 6 ELECTIVES (Technical Electives Group B)
    {
      programId: [beiProgram._id],
      code: "EX625001",
      name: "VLSI Design",
      description: "Very Large Scale Integration design principles and methodologies.",
      credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      requiresLab: false,
      defaultLabGroups: 2,
      preferredRoomTypes: ["Lecture Hall"],
      defaultClassType: "L",
      semester: 6,
      isActive: true
    },
    {
      programId: [beiProgram._id],
      code: "EX625002",
      name: "Advanced Microcontroller Applications",
      description: "Advanced microcontroller programming and real-world applications.",
      credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      requiresLab: false,
      defaultLabGroups: 2,
      preferredRoomTypes: ["Lecture Hall"],
      defaultClassType: "L",
      semester: 6,
      isActive: true
    },
    {
      programId: [beiProgram._id],
      code: "EX625003",
      name: "Sensor Networks and IoT",
      description: "Wireless sensor networks and Internet of Things applications.",
      credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      requiresLab: false,
      defaultLabGroups: 2,
      preferredRoomTypes: ["Lecture Hall"],
      defaultClassType: "L",
      semester: 6,
      isActive: true
    },
    {
      programId: [beiProgram._id],
      code: "EX625004",
      name: "Optical Communications",
      description: "Fiber optic communication systems and optical networking.",
      credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      requiresLab: false,
      defaultLabGroups: 2,
      preferredRoomTypes: ["Lecture Hall"],
      defaultClassType: "L",
      semester: 6,
      isActive: true
    },
    {
      programId: [beiProgram._id],
      code: "EX625005",
      name: "Machine Learning for Engineers",
      description: "Machine learning algorithms and applications in engineering.",
      credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      requiresLab: false,
      defaultLabGroups: 2,
      preferredRoomTypes: ["Lecture Hall"],
      defaultClassType: "L",
      semester: 6,
      isActive: true
    },

    // SEMESTER 7 ELECTIVES (Advanced Technical Electives Group A)
    {
      programId: [beiProgram._id],
      code: "EX725001",
      name: "Advanced Java Programming",
      description: "Advanced Java programming concepts and enterprise applications.",
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
      code: "EX725002",
      name: "Data Mining and Warehousing",
      description: "Data mining techniques and data warehouse design principles.",
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
      code: "EX725003",
      name: "Embedded System Design Using ARM",
      description: "ARM processor-based embedded system design and development.",
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
      code: "EX725004",
      name: "Image Processing & Pattern Recognition",
      description: "Advanced image processing and pattern recognition techniques.",
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
      code: "EX725005",
      name: "Web Technology",
      description: "Web development technologies and frameworks.",
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
      code: "EX725006",
      name: "Radar Technology",
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
      code: "EX725007",
      name: "Satellite Communication",
      description: "Satellite communication systems and space technology.",
      credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      requiresLab: false,
      defaultLabGroups: 2,
      preferredRoomTypes: ["Lecture Hall"],
      defaultClassType: "L",
      semester: 7,
      isActive: true
    },

    // SEMESTER 8 ELECTIVES (Advanced Technical Electives Group B)
    {
      programId: [beiProgram._id],
      code: "EX825001",
      name: "Optical Fiber Communication System",
      description: "Advanced optical fiber communication systems and networks.",
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
      code: "EX825002",
      name: "Agile Software Development",
      description: "Agile methodologies and software development practices.",
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
      code: "EX825003",
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
      code: "EX825004",
      name: "Advanced Computer Architecture",
      description: "Modern computer architecture and parallel processing.",
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
      code: "EX825005",
      name: "Big Data Technologies",
      description: "Big data processing and analytics technologies.",
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
      code: "EX825006",
      name: "Remote Sensing",
      description: "Remote sensing principles and applications.",
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
      code: "EX825007",
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
      code: "EX825008",
      name: "Enterprise Application Design & Development",
      description: "Large-scale enterprise application development.",
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
      code: "EX825009",
      name: "XML Foundations & Applications",
      description: "XML technologies and web service development.",
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
      code: "EX825010",
      name: "Geographical Information System",
      description: "GIS technology and spatial data analysis.",
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
      code: "EX825011",
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
      code: "EX825012",
      name: "Broadcast Engineering",
      description: "Radio and television broadcasting systems.",
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
      code: "EX825013",
      name: "Advanced Wireless Communication",
      description: "5G/6G wireless technologies and mobile communications.",
      credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
      requiresLab: false,
      defaultLabGroups: 2,
      preferredRoomTypes: ["Lecture Hall"],
      defaultClassType: "L",
      semester: 8,
      isActive: true
    }
  ];    // Create elective subjects
    console.log('Creating BEI elective subjects...');
    const createdElectiveSubjects = [];
    
    for (const subjectData of beiElectiveSubjects) {
      try {
        // Check if subject already exists
        const existingSubject = await Subject.findOne({ code: subjectData.code });
        if (existingSubject) {
          console.log(`Subject ${subjectData.code} already exists, skipping...`);
          createdElectiveSubjects.push(existingSubject);
          continue;
        }

        const subject = new Subject(subjectData);
        await subject.save();
        createdElectiveSubjects.push(subject);
        console.log(`✅ Created elective subject: ${subject.code} - ${subject.name} (Semester ${subject.semester})`);
      } catch (error) {
        console.error(`❌ Error creating elective subject ${subjectData.code}:`, error.message);
      }
    }

    // Create Elective Groups
    console.log('\nCreating BEI elective groups...');

    // 5th Semester Technical Electives Group
    const fifthSemesterElectives = createdElectiveSubjects.filter(s => s.semester === 5);
    const electiveGroup5th = {
      programId: beiProgram._id,
      academicYearId: currentAcademicYear._id,
      name: "5th Semester Technical Electives",
      code: "BEI-5TH-TECH",
      semester: 5,
      subjects: fifthSemesterElectives.map(subject => ({
        subjectId: subject._id,
        subjectCode: subject.code,
        subjectName: subject.name,
        maxSections: 2, // Both AB and CD sections can choose
        currentSelections: 0,
        isAvailable: true,
        credits: subject.credits,
        weeklyHours: subject.weeklyHours,
        requiresLab: subject.requiresLab
      })),
      rules: {
        minRequired: 1,
        maxAllowed: 1,
        isMandatory: true
      },
      isActive: true
    };

    // 6th Semester Technical Electives Group
    const sixthSemesterElectives = createdElectiveSubjects.filter(s => s.semester === 6);
    const electiveGroup6th = {
      programId: beiProgram._id,
      academicYearId: currentAcademicYear._id,
      name: "6th Semester Technical Electives",
      code: "BEI-6TH-TECH",
      semester: 6,
      subjects: sixthSemesterElectives.map(subject => ({
        subjectId: subject._id,
        subjectCode: subject.code,
        subjectName: subject.name,
        maxSections: 2, // Both AB and CD sections can choose
        currentSelections: 0,
        isAvailable: true,
        credits: subject.credits,
        weeklyHours: subject.weeklyHours,
        requiresLab: subject.requiresLab
      })),
      rules: {
        minRequired: 1,
        maxAllowed: 1,
        isMandatory: true
      },
      isActive: true
    };

    // 7th Semester Technical Electives Group
    const seventhSemesterElectives = createdElectiveSubjects.filter(s => s.semester === 7);
    const electiveGroup7th = {
      programId: beiProgram._id,
      academicYearId: currentAcademicYear._id,
      name: "7th Semester Technical Electives",
      code: "BEI-7TH-TECH",
      semester: 7,
      subjects: seventhSemesterElectives.map(subject => ({
        subjectId: subject._id,
        subjectCode: subject.code,
        subjectName: subject.name,
        maxSections: 2, // Both AB and CD sections can choose
        currentSelections: 0,
        isAvailable: true,
        credits: subject.credits,
        weeklyHours: subject.weeklyHours,
        requiresLab: subject.requiresLab
      })),
      rules: {
        minRequired: 1,
        maxAllowed: 1,
        isMandatory: true
      },
      isActive: true
    };

    // 8th Semester Advanced Electives Group  
    const eighthSemesterElectives = createdElectiveSubjects.filter(s => s.semester === 8);
    const electiveGroup8th = {
      programId: beiProgram._id,
      academicYearId: currentAcademicYear._id,
      name: "8th Semester Advanced Electives",
      code: "BEI-8TH-ADV",
      semester: 8,
      subjects: eighthSemesterElectives.map(subject => ({
        subjectId: subject._id,
        subjectCode: subject.code,
        subjectName: subject.name,
        maxSections: 2, // Both AB and CD sections can choose
        currentSelections: 0,
        isAvailable: true,
        credits: subject.credits,
        weeklyHours: subject.weeklyHours,
        requiresLab: subject.requiresLab
      })),
      rules: {
        minRequired: 1,
        maxAllowed: 1,
        isMandatory: true
      },
      isActive: true
    };

    // Create elective groups
    try {
      // Check if groups already exist
      const existing7th = await ElectiveGroup.findOne({ code: electiveGroup7th.code });
      if (!existing7th) {
        const group7th = new ElectiveGroup(electiveGroup7th);
        await group7th.save();
        console.log(`✅ Created elective group: ${group7th.code} - ${group7th.name}`);
      } else {
        console.log(`Elective group ${electiveGroup7th.code} already exists, skipping...`);
      }

      const existing8th = await ElectiveGroup.findOne({ code: electiveGroup8th.code });
      if (!existing8th) {
        const group8th = new ElectiveGroup(electiveGroup8th);
        await group8th.save();
        console.log(`✅ Created elective group: ${group8th.code} - ${group8th.name}`);
      } else {
        console.log(`Elective group ${electiveGroup8th.code} already exists, skipping...`);
      }

    } catch (error) {
      console.error(`❌ Error creating elective groups:`, error.message);
    }

    console.log('\n🎉 BEI elective subjects and groups populated successfully!');
    
    // Verify the results
    const totalElectiveSubjects = await Subject.countDocuments({ 
      programId: { $in: [beiProgram._id] },
      isElective: true
    });
    console.log(`\n📊 Total BEI elective subjects in database: ${totalElectiveSubjects}`);
    
    // Count by semester
    const seventhSemElectives = await Subject.countDocuments({ 
      programId: { $in: [beiProgram._id] },
      semester: 7,
      isElective: true
    });
    const eighthSemElectives = await Subject.countDocuments({ 
      programId: { $in: [beiProgram._id] },
      semester: 8,
      isElective: true
    });
    
    console.log(`   7th Semester Electives: ${seventhSemElectives} subjects`);
    console.log(`   8th Semester Electives: ${eighthSemElectives} subjects`);

    // Display elective groups
    const electiveGroups = await ElectiveGroup.find({ 
      programId: beiProgram._id 
    }).populate('subjects.subjectId', 'code name');
    
    console.log('\n📋 Elective Groups Created:');
    electiveGroups.forEach(group => {
      console.log(`\n${group.name} (${group.code})`);
      console.log(`  Semester: ${group.semester}`);
      console.log(`  Rules: Min ${group.rules.minRequired}, Max ${group.rules.maxAllowed}`);
      console.log(`  Available Subjects: ${group.subjects.length}`);
      group.subjects.forEach((subject, index) => {
        console.log(`    ${index + 1}. ${subject.subjectCode} - ${subject.subjectName}`);
      });
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error populating BEI electives:', error);
    mongoose.connection.close();
  }
};

populateBEIElectives();
