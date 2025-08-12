const TimeSlot = require('./models/TimeSlot');
require('./config/db');

async function checkTimeSlots() {
  try {
    console.log('🔍 Checking all time slots in database...');
    
    const allTimeSlots = await TimeSlot.find().sort({ sortOrder: 1 });
    console.log(`Total time slots: ${allTimeSlots.length}`);
    
    allTimeSlots.forEach(slot => {
      console.log(`ID: ${slot._id}, Label: ${slot.label}, Sort: ${slot.sortOrder}, Global: ${slot.isGlobal}, Program: ${slot.programCode}, Semester: ${slot.semester}, Section: ${slot.section}`);
    });
    
    console.log('\n🔍 Checking global time slots specifically...');
    const globalTimeSlots = await TimeSlot.find({
      $or: [
        { isGlobal: true },
        { isGlobal: { $exists: false } },
        { isGlobal: null }
      ]
    }).sort({ sortOrder: 1 });
    
    console.log(`Global time slots: ${globalTimeSlots.length}`);
    globalTimeSlots.forEach(slot => {
      console.log(`ID: ${slot._id}, Label: ${slot.label}, Sort: ${slot.sortOrder}, Global: ${slot.isGlobal}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setTimeout(checkTimeSlots, 1000);
