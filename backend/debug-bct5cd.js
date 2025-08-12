// Quick debug of time slots issue
const RoutineSlot = require('./models/RoutineSlot');
const TimeSlot = require('./models/TimeSlot');

async function debugBCT5CD() {
  try {
    console.log('🔍 Debugging BCT-5-CD time slot mapping...');
    
    // Get routine slots for BCT-5-CD
    const routineSlots = await RoutineSlot.find({
      programCode: 'BCT',
      semester: 5,
      section: 'CD',
      isActive: true
    }).populate('subjectId', 'name code').sort({ dayIndex: 1, slotIndex: 1 });
    
    console.log(`\n📋 Found ${routineSlots.length} routine slots for BCT-5-CD:`);
    routineSlots.forEach(slot => {
      console.log(`  Day: ${slot.dayIndex}, SlotIndex: ${slot.slotIndex}, Subject: ${slot.subjectId?.name || 'Unknown'}, LabGroup: ${slot.labGroup || 'None'}`);
    });
    
    // Get time slots available for BCT-5-CD
    const timeSlots = await TimeSlot.find({
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
    
    console.log(`\n⏰ Available time slots for BCT-5-CD (${timeSlots.length}):`);
    timeSlots.forEach(slot => {
      console.log(`  ID: ${slot._id}, Label: ${slot.label}, SortOrder: ${slot.sortOrder}, IsGlobal: ${slot.isGlobal}`);
    });
    
    // Check mapping issues
    console.log('\n🔧 Checking slotIndex to TimeSlot mapping:');
    const usedSlotIndices = [...new Set(routineSlots.map(slot => slot.slotIndex))].sort((a, b) => a - b);
    usedSlotIndices.forEach(slotIndex => {
      const timeSlot = timeSlots.find(ts => ts._id === slotIndex);
      if (timeSlot) {
        console.log(`  ✅ SlotIndex ${slotIndex} -> TimeSlot ID ${timeSlot._id} (${timeSlot.label})`);
      } else {
        console.log(`  ❌ SlotIndex ${slotIndex} -> NO MATCHING TIME SLOT FOUND!`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

module.exports = { debugBCT5CD };
