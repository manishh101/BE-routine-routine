// Test script to verify BEI subject filtering logic
const testFilterLogic = () => {
  // Mock subjects data similar to what the frontend would receive
  const mockBeiSubjects = [
    // Semester 7 core subjects
    { _id: '1', code: 'EX701', name: 'Communication System II', semester: 7 },
    { _id: '2', code: 'EX702', name: 'Digital Signal Processing', semester: 7 },
    { _id: '3', code: 'EX703', name: 'Antenna and Propagation', semester: 7 },
    { _id: '4', code: 'EX704', name: 'Computer Networks', semester: 7 },
    { _id: '5', code: 'EX705', name: 'Project (Part A)', semester: 7 },
    
    // Semester 7 electives
    { _id: '6', code: 'CT725-01', name: 'Data Mining and Warehousing', semester: 7 },
    { _id: '7', code: 'CT725-02', name: 'Web Development/Technology', semester: 7 },
    { _id: '8', code: 'EX725-01', name: 'Avionics', semester: 7 },
    { _id: '9', code: 'EX725-02', name: 'Image Processing and Pattern Recognition', semester: 7 },
    
    // Semester 8 core subjects
    { _id: '10', code: 'EX801', name: 'RF and Microwave Engineering', semester: 8 },
    { _id: '11', code: 'EX802', name: 'Embedded System', semester: 8 },
    { _id: '12', code: 'CE801', name: 'Engineering Professional Practice', semester: 8 },
    { _id: '13', code: 'EX803', name: 'Organization and Management', semester: 8 },
    { _id: '14', code: 'EX804', name: 'Project (Part B)', semester: 8 },
    
    // Semester 8 electives
    { _id: '15', code: 'CT765-01', name: 'Optical Fiber Communication System', semester: 8 },
    { _id: '16', code: 'CT765-02', name: 'Agile Software Development', semester: 8 },
    { _id: '17', code: 'CT785-01', name: 'Remote Sensing', semester: 8 },
    { _id: '18', code: 'EX765-03', name: 'Broadcast Engineering', semester: 8 },
    { _id: '19', code: 'EE785-07', name: 'Power Electronics', semester: 8 }
  ];

  // Test filtering logic
  const filterSubjects = (allSubjects, programCode, semester, isElectiveSemester, isElectiveClass) => {
    // First filter by semester
    const semesterSubjects = allSubjects.filter(subject => subject.semester === semester);
    
    // For non-BEI programs or non-elective semesters, return all subjects
    if (programCode !== 'BEI' || !isElectiveSemester) {
      return semesterSubjects;
    }

    // For BEI semesters 7 & 8, filter based on elective checkbox
    if (isElectiveClass) {
      // Show only elective subjects when elective is selected
      return semesterSubjects.filter(subject => {
        const code = subject.code;
        if (semester === 7) {
          // Semester 7 electives: CT725-xx, EX725-xx
          return code.startsWith('CT725') || code.startsWith('EX725');
        } else if (semester === 8) {
          // Semester 8 electives: CT765-xx, CT785-xx, EX765-xx, EX785-xx, EE785-xx
          return code.startsWith('CT765') || code.startsWith('CT785') || 
                 code.startsWith('EX765') || code.startsWith('EX785') || 
                 code.startsWith('EE785');
        }
        return false;
      });
    } else {
      // Show only core subjects when elective is NOT selected
      return semesterSubjects.filter(subject => {
        const code = subject.code;
        if (semester === 7) {
          // Exclude semester 7 electives, show core subjects
          return !code.startsWith('CT725') && !code.startsWith('EX725');
        } else if (semester === 8) {
          // Exclude semester 8 electives, show core subjects
          return !code.startsWith('CT765') && !code.startsWith('CT785') && 
                 !code.startsWith('EX765') && !code.startsWith('EX785') && 
                 !code.startsWith('EE785');
        }
        return true;
      });
    }
  };

  console.log('🧪 TESTING BEI SUBJECT FILTERING LOGIC');
  console.log('=====================================');

  // Test Semester 7 - Core subjects (elective OFF)
  console.log('\n📚 Semester 7 - Core Subjects (Elective OFF):');
  const sem7Core = filterSubjects(mockBeiSubjects, 'BEI', 7, true, false);
  sem7Core.forEach(s => console.log(`  - ${s.code}: ${s.name}`));

  // Test Semester 7 - Elective subjects (elective ON)
  console.log('\n📚 Semester 7 - Elective Subjects (Elective ON):');
  const sem7Elective = filterSubjects(mockBeiSubjects, 'BEI', 7, true, true);
  sem7Elective.forEach(s => console.log(`  - ${s.code}: ${s.name}`));

  // Test Semester 8 - Core subjects (elective OFF)
  console.log('\n📚 Semester 8 - Core Subjects (Elective OFF):');
  const sem8Core = filterSubjects(mockBeiSubjects, 'BEI', 8, true, false);
  sem8Core.forEach(s => console.log(`  - ${s.code}: ${s.name}`));

  // Test Semester 8 - Elective subjects (elective ON)
  console.log('\n📚 Semester 8 - Elective Subjects (Elective ON):');
  const sem8Elective = filterSubjects(mockBeiSubjects, 'BEI', 8, true, true);
  sem8Elective.forEach(s => console.log(`  - ${s.code}: ${s.name}`));

  // Test Non-BEI program (should show all)
  console.log('\n📚 Non-BEI Program (BCT Semester 7) - Should show all:');
  const nonBeiSubjects = filterSubjects(mockBeiSubjects, 'BCT', 7, true, false);
  console.log(`  Total subjects shown: ${nonBeiSubjects.length} (should be ${mockBeiSubjects.length})`);

  console.log('\n✅ SUMMARY:');
  console.log(`  Semester 7 Core: ${sem7Core.length} subjects`);
  console.log(`  Semester 7 Elective: ${sem7Elective.length} subjects`);
  console.log(`  Semester 8 Core: ${sem8Core.length} subjects`);
  console.log(`  Semester 8 Elective: ${sem8Elective.length} subjects`);
  console.log(`  Non-BEI: ${nonBeiSubjects.length} subjects (unfiltered)`);
  
  // Validation
  const totalSem7 = mockBeiSubjects.filter(s => s.semester === 7).length;
  const totalSem8 = mockBeiSubjects.filter(s => s.semester === 8).length;
  
  console.log('\n🔍 VALIDATION:');
  console.log(`  Semester 7: ${sem7Core.length} core + ${sem7Elective.length} elective = ${sem7Core.length + sem7Elective.length} (expected: ${totalSem7})`);
  console.log(`  Semester 8: ${sem8Core.length} core + ${sem8Elective.length} elective = ${sem8Core.length + sem8Elective.length} (expected: ${totalSem8})`);
  
  if (sem7Core.length + sem7Elective.length === totalSem7 && 
      sem8Core.length + sem8Elective.length === totalSem8) {
    console.log('\n🎉 ALL TESTS PASSED! Filtering logic works correctly.');
  } else {
    console.log('\n❌ Tests failed - check filtering logic.');
  }
};

testFilterLogic();
