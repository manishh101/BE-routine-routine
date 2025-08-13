const mongoose = require('mongoose');
const Subject = require('./models/Subject');
const Program = require('./models/Program');

// Connect to MongoDB
mongoose.connect('mongodb+srv://079bct044manish:routine@routine.mrjj7ho.mongodb.net/bctroutine?retryWrites=true&w=majority&appName=routine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const populateBEISubjects = async () => {
  try {
    // Use the provided BEI program _id directly
    const beiProgram = { _id: new mongoose.Types.ObjectId('6867f6be5a23774ba0443293') };
    
    const beiSubjects = [
      // SEMESTER 1
      {
        programId: [beiProgram._id],
        code: "SH401",
        name: "Engineering Mathematics I",
        description: "Calculus, Differential Equations, Vector Algebra and Complex Numbers.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 1,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT401",
        name: "Computer Programming",
        description: "Introduction to programming concepts using C programming language.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Computer Lab"],
        defaultClassType: "L",
        semester: 1,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "ME401",
        name: "Engineering Drawing I",
        description: "Fundamentals of engineering drawing and CAD.",
        credits: { theory: 1, practical: 2, tutorial: 0, total: 3 },
        weeklyHours: { theory: 1, practical: 2, tutorial: 0, total: 3 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "P",
        semester: 1,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "SH402",
        name: "Engineering Physics",
        description: "Fundamental concepts of physics for engineering applications.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 1,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX401",
        name: "Basic Electrical Engineering",
        description: "Fundamentals of electrical circuits, DC and AC analysis.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 1,
        isActive: true
      },

      // SEMESTER 2
      {
        programId: [beiProgram._id],
        code: "SH451",
        name: "Engineering Mathematics II",
        description: "Linear Algebra, Fourier Series, Laplace Transform.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 2,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT451",
        name: "Object Oriented Programming",
        description: "Object-oriented programming concepts using C++ or Java.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Computer Lab"],
        defaultClassType: "L",
        semester: 2,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX451",
        name: "Logic Circuits",
        description: "Boolean algebra, combinational and sequential logic circuits.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 2,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX452",
        name: "Electronic Devices and Circuits",
        description: "Semiconductor devices, diodes, transistors, and basic amplifiers.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 2,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "SH453",
        name: "Engineering Chemistry",
        description: "Chemical concepts for engineering applications.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 2,
        isActive: true
      },

      // SEMESTER 3
      {
        programId: [beiProgram._id],
        code: "SH501",
        name: "Engineering Mathematics III",
        description: "Partial differential equations, vector calculus, and probability.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 3,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "SH502",
        name: "Applied Mechanics",
        description: "Statics, dynamics, and strength of materials for electronics engineers.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 3,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX501",
        name: "Electric Circuit Theory",
        description: "Advanced circuit analysis techniques, network theorems.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 3,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX502",
        name: "Electronics Engineering Materials",
        description: "Properties and applications of electronic materials.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 3,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX503",
        name: "Electromagnetics",
        description: "Electromagnetic field theory and wave propagation.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 3,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT501",
        name: "Data Structure and Algorithm",
        description: "Linear and non-linear data structures, algorithm analysis.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Computer Lab"],
        defaultClassType: "L",
        semester: 3,
        isActive: true
      },

      // SEMESTER 4
      {
        programId: [beiProgram._id],
        code: "SH551",
        name: "Numerical Methods",
        description: "Numerical techniques for solving engineering problems.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Computer Lab"],
        defaultClassType: "L",
        semester: 4,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX551",
        name: "Microprocessor",
        description: "8085/8086 microprocessor architecture, programming, and interfacing.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 4,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX552",
        name: "Instrumentation I",
        description: "Measurement systems, transducers, and signal conditioning.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 4,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX553",
        name: "Applied Electronics",
        description: "Operational amplifiers, analog and digital circuits.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 4,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX554",
        name: "Discrete Structure",
        description: "Mathematical foundations for computer science and electronics.",
        credits: { theory: 3, practical: 0, tutorial: 1, total: 4 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 1, total: 4 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 4,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX555",
        name: "Electrical Machines",
        description: "DC and AC machines, transformers, and motor control.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 4,
        isActive: true
      },

      // SEMESTER 5
      {
        programId: [beiProgram._id],
        code: "SH601",
        name: "Probability and Statistics",
        description: "Statistical methods and probability theory for engineers.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Computer Lab"],
        defaultClassType: "L",
        semester: 5,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX601",
        name: "Linear Integrated Circuits",
        description: "Design and applications of linear integrated circuits.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 5,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX602",
        name: "Instrumentation II",
        description: "Advanced instrumentation and control systems.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 5,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX603",
        name: "Computer Organization and Architecture",
        description: "Computer hardware design and organization.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Computer Lab"],
        defaultClassType: "L",
        semester: 5,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX604",
        name: "Signals and Systems",
        description: "Continuous and discrete signals, system analysis.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 5,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CT601",
        name: "Database Management System",
        description: "Database design, SQL, and database administration.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Computer Lab"],
        defaultClassType: "L",
        semester: 5,
        isActive: true
      },

      // SEMESTER 6
      {
        programId: [beiProgram._id],
        code: "CE655",
        name: "Engineering Economics",
        description: "Economic analysis of engineering projects.",
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
        code: "EX651",
        name: "Communication System I",
        description: "Analog communication systems and modulation techniques.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 6,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX652",
        name: "Automatic Control System",
        description: "Feedback control systems, stability analysis, and compensation.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 6,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX653",
        name: "Microcontroller",
        description: "8051/PIC microcontroller programming and applications.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 6,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX654",
        name: "Filter Design",
        description: "Active and passive filter design and synthesis.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 6,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX655",
        name: "Minor Project",
        description: "Small scale project work to apply theoretical knowledge.",
        credits: { theory: 0, practical: 2, tutorial: 0, total: 2 },
        weeklyHours: { theory: 0, practical: 2, tutorial: 0, total: 2 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Project Lab"],
        defaultClassType: "P",
        semester: 6,
        isActive: true
      },

      // SEMESTER 7
      {
        programId: [beiProgram._id],
        code: "EX701",
        name: "Communication System II",
        description: "Digital communication systems and advanced modulation.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 7,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX702",
        name: "Digital Signal Processing",
        description: "Digital filters, FFT, and DSP applications.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 7,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX703",
        name: "Antenna and Propagation",
        description: "Antenna theory, design, and wave propagation.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 7,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX704",
        name: "Computer Networks",
        description: "Network protocols, architecture, and security.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Computer Lab"],
        defaultClassType: "L",
        semester: 7,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX705",
        name: "Project (Part A)",
        description: "Final year project planning and initial implementation.",
        credits: { theory: 0, practical: 3, tutorial: 0, total: 3 },
        weeklyHours: { theory: 0, practical: 3, tutorial: 0, total: 3 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Project Lab"],
        defaultClassType: "P",
        semester: 7,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX761",
        name: "Elective I",
        description: "Choose from: Digital System Design, Information Theory, Power Electronics, etc.",
        credits: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        weeklyHours: { theory: 3, practical: 0, tutorial: 0, total: 3 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 7,
        isActive: true
      },

      // SEMESTER 8
      {
        programId: [beiProgram._id],
        code: "EX801",
        name: "RF and Microwave Engineering",
        description: "High frequency circuit design and microwave systems.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX802",
        name: "Embedded System",
        description: "Real-time systems, RTOS, and embedded programming.",
        credits: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        weeklyHours: { theory: 3, practical: 1, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Electronics Lab"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "CE801",
        name: "Engineering Professional Practice",
        description: "Ethics, professional conduct, and project management.",
        credits: { theory: 2, practical: 0, tutorial: 0, total: 2 },
        weeklyHours: { theory: 2, practical: 0, tutorial: 0, total: 2 },
        requiresLab: false,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Lecture Hall"],
        defaultClassType: "L",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX803",
        name: "Organization and Management",
        description: "Business management and organizational behavior.",
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
        code: "EX804",
        name: "Project (Part B)",
        description: "Final year project completion and documentation.",
        credits: { theory: 0, practical: 4, tutorial: 0, total: 4 },
        weeklyHours: { theory: 0, practical: 4, tutorial: 0, total: 4 },
        requiresLab: true,
        defaultLabGroups: 2,
        preferredRoomTypes: ["Project Lab"],
        defaultClassType: "P",
        semester: 8,
        isActive: true
      },
      {
        programId: [beiProgram._id],
        code: "EX862",
        name: "Elective II",
        description: "Choose from: VLSI Design, Biomedical Engineering, Image Processing, etc.",
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

    // Remove existing BEI subjects for all semesters to avoid duplicates
    await Subject.deleteMany({
      programId: { $in: [beiProgram._id] },
      semester: { $in: [1, 2, 3, 4, 5, 6, 7, 8] }
    });

    console.log('Removed existing BEI subjects for all semesters');

    // Insert the new BEI subjects
    for (const subjectData of beiSubjects) {
      try {
        const subject = new Subject(subjectData);
        await subject.save();
        console.log(`✅ Created subject: ${subject.code} - ${subject.name} (Semester ${subject.semester})`);
      } catch (error) {
        console.error(`❌ Error creating subject ${subjectData.code}:`, error.message);
      }
    }

    console.log('\n🎉 BEI subjects populated successfully with updated curriculum!');
    
    // Verify the results
    const totalBEISubjects = await Subject.countDocuments({ programId: { $in: [beiProgram._id] } });
    console.log(`\n📊 Total BEI subjects in database: ${totalBEISubjects}`);
    
    // Count by semester
    for (let semester = 1; semester <= 8; semester++) {
      const count = await Subject.countDocuments({ 
        programId: { $in: [beiProgram._id] },
        semester: semester
      });
      console.log(`   Semester ${semester}: ${count} subjects`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error populating BEI subjects:', error);
    mongoose.connection.close();
  }
};

populateBEISubjects();
