const mongoose = require('mongoose');
const TimeSlot = require('./models/TimeSlot');
require('./config/db');

async function debugTimeSlots() {
  try {
    console.log('🔍 Fetching all time slots...');
    const timeSlots = await TimeSlot.find().sort({ sortOrder: 1 });
    
    console.log(`\n📊 Found ${timeSlots.length} time slots:`);
    timeSlots.forEach(slot => {
      console.log(`  ID: ${slot._id}, Label: ${slot.label}, Sort: ${slot.sortOrder}, Global: ${slot.isGlobal}, Program: ${slot.programCode}, Semester: ${slot.semester}, Section: ${slot.section}`);
    });
    
    console.log('\n🔍 Checking time slots for BCT-5-CD context...');
    const bctTimeSlots = await TimeSlot.find({
      $or: [
        { isGlobal: true },
        { isGlobal: { $exists: false } },
        { isGlobal: null },
        {
          isGlobal: false,
          programCode: 'BCT',
          semester: 5,
          section: 'CD'
        }
      ]
    }).sort({ sortOrder: 1 });
    
    console.log(`\n📊 BCT-5-CD relevant time slots (${bctTimeSlots.length}):`);
    bctTimeSlots.forEach(slot => {
      console.log(`  ID: ${slot._id}, Label: ${slot.label}, Sort: ${slot.sortOrder}, Global: ${slot.isGlobal}, Program: ${slot.programCode}, Semester: ${slot.semester}, Section: ${slot.section}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugTimeSlots();
