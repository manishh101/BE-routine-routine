// Test script for elective subject filtering

// Mock subjects data
const beiSubjects = [
  { code: "CT725-01", name: "Data Mining and Warehousing", subjectId: "1" },
  { code: "CT765-02", name: "Agile Software Development", subjectId: "2" },
  { code: "EX725-01", name: "Avionics", subjectId: "3" },
  { code: "CT701", name: "ICT Project Management", subjectId: "4" }, // Regular subject
];

const bctSubjects = [
  { code: "CT72502", name: "Data Mining and Warehousing", subjectId: "5" },
  { code: "CT76502", name: "Agile Software Development", subjectId: "6" },
  { code: "EX72502", name: "Radar Technology", subjectId: "7" },
  { code: "CT701", name: "ICT Project Management", subjectId: "8" }, // Regular subject
];

// Filtering function
const isElectiveSubject = (subject, programCode) => {
  if (!subject || !subject.code) return false;
  
  const code = subject.code.toUpperCase();
  
  if (programCode === 'BEI') {
    // BEI elective patterns (semester 7 & 8)
    return code.match(/^(CT725|CT765|CT785|EX725|EX765|EX785|EE785)-?\d+$/);
  } else if (programCode === 'BCT') {
    // BCT elective patterns (semester 7 & 8)
    return code.match(/^(CT725|CT765|CT785|EE725|EX725|EX765|EX785)\d+$/) ||
           code.match(/^(CT72[5-9]|CT76[0-9]|CT78[0-9]|EE72[0-9]|EX72[0-9]|EX76[0-9]|EX78[0-9])\d+$/);
  }
  
  return false;
};

// Test BEI filtering
console.log('=== BEI ELECTIVE FILTERING TEST ===');
beiSubjects.forEach(subject => {
  const isElective = isElectiveSubject(subject, 'BEI');
  console.log(`${subject.code} (${subject.name}): ${isElective ? 'ELECTIVE' : 'REGULAR'}`);
});

// Test BCT filtering
console.log('\n=== BCT ELECTIVE FILTERING TEST ===');
bctSubjects.forEach(subject => {
  const isElective = isElectiveSubject(subject, 'BCT');
  console.log(`${subject.code} (${subject.name}): ${isElective ? 'ELECTIVE' : 'REGULAR'}`);
});

console.log('\n=== SUMMARY ===');
console.log('BEI electives found:', beiSubjects.filter(s => isElectiveSubject(s, 'BEI')).length);
console.log('BCT electives found:', bctSubjects.filter(s => isElectiveSubject(s, 'BCT')).length);
