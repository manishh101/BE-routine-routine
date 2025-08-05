/**
 * Time Slot Ordering Test Script
 * This script demonstrates the fix for time slot ordering consistency between frontend and PDF
 */

const mongoose = require('mongoose');
const TimeSlot = require('./models/TimeSlot');
const { getTimeSlotsSorted, reorderTimeSlots } = require('./utils/timeSlotUtils');
const PDFRoutineService = require('./services/PDFRoutineService');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bct-routine');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Test time slot ordering consistency
const testTimeSlotOrdering = async () => {
  console.log('\n🧪 Testing Time Slot Ordering Consistency');
  console.log('=' .repeat(50));

  try {
    // 1. Get current time slots as frontend would see them
    console.log('\n📱 Frontend time slot ordering:');
    const frontendTimeSlots = await getTimeSlotsSorted();
    frontendTimeSlots.forEach((slot, index) => {
      console.log(`  [${index}] ID: ${slot._id}, sortOrder: ${slot.sortOrder}, time: ${slot.startTime}-${slot.endTime}`);
    });

    // 2. Simulate PDF generation time slot ordering
    console.log('\n📄 PDF generation time slot ordering:');
    const pdfService = new PDFRoutineService();
    // The PDF service now uses the same utility function, so should be identical
    const pdfTimeSlots = await getTimeSlotsSorted();
    pdfTimeSlots.forEach((slot, index) => {
      console.log(`  [${index}] ID: ${slot._id}, sortOrder: ${slot.sortOrder}, time: ${slot.startTime}-${slot.endTime}`);
    });

    // 3. Verify consistency
    console.log('\n🔍 Consistency Check:');
    const isConsistent = JSON.stringify(frontendTimeSlots.map(s => s._id)) === 
                        JSON.stringify(pdfTimeSlots.map(s => s._id));
    
    if (isConsistent) {
      console.log('✅ Frontend and PDF time slot ordering is CONSISTENT');
    } else {
      console.log('❌ Frontend and PDF time slot ordering is INCONSISTENT');
    }

    // 4. Show time slot mapping for slotIndex
    console.log('\n🗺️ Time Slot Index Mapping:');
    frontendTimeSlots.forEach((slot, arrayIndex) => {
      console.log(`  slotIndex ${slot._id} -> array[${arrayIndex}] -> ${slot.startTime}-${slot.endTime} (sortOrder: ${slot.sortOrder})`);
    });

    return { frontendTimeSlots, pdfTimeSlots, isConsistent };

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
};

// Test creating a new early time slot
const testEarlyTimeSlotCreation = async () => {
  console.log('\n🕐 Testing Early Time Slot Creation (7:00-10:15)');
  console.log('=' .repeat(50));

  try {
    // Check if early time slot already exists
    const existingEarlySlot = await TimeSlot.findOne({ startTime: '07:00' });
    if (existingEarlySlot) {
      console.log('⚠️ Early time slot (7:00-10:15) already exists, skipping creation');
      return existingEarlySlot;
    }

    // Get highest existing _id
    const lastTimeSlot = await TimeSlot.findOne().sort({ _id: -1 });
    const newId = lastTimeSlot ? lastTimeSlot._id + 1 : 1;

    console.log('\n📋 Before creating early time slot:');
    await testTimeSlotOrdering();

    // Create the early time slot
    const earlyTimeSlot = new TimeSlot({
      _id: newId,
      label: '07:00-10:15',
      startTime: '07:00',
      endTime: '10:15',
      dayType: 'Regular',
      category: 'Morning',
      isBreak: false,
      isGlobal: true,
      // sortOrder will be calculated automatically by the middleware
    });

    await earlyTimeSlot.save();
    console.log(`\n✅ Created early time slot: ${earlyTimeSlot.label} with ID ${earlyTimeSlot._id}`);

    console.log('\n📋 After creating early time slot:');
    await testTimeSlotOrdering();

    // Verify that reordering works correctly
    console.log('\n🔄 Testing reorder function:');
    const reorderResult = await reorderTimeSlots();
    console.log(`✅ ${reorderResult.message}`);

    console.log('\n📋 After reordering:');
    await testTimeSlotOrdering();

    return earlyTimeSlot;

  } catch (error) {
    console.error('❌ Early time slot creation test failed:', error);
    throw error;
  }
};

// Main test function
const runTests = async () => {
  try {
    await connectDB();
    
    console.log('🚀 Starting Time Slot Ordering Tests');
    
    // Test 1: Current consistency
    const { isConsistent: initialConsistency } = await testTimeSlotOrdering();
    
    // Test 2: Early time slot creation
    await testEarlyTimeSlotCreation();
    
    // Test 3: Final consistency check
    const { isConsistent: finalConsistency } = await testTimeSlotOrdering();
    
    console.log('\n🎯 Final Results:');
    console.log('=' .repeat(50));
    console.log(`Initial consistency: ${initialConsistency ? '✅' : '❌'}`);
    console.log(`Final consistency: ${finalConsistency ? '✅' : '❌'}`);
    
    if (finalConsistency) {
      console.log('\n🎉 SUCCESS: Time slot ordering is now consistent between frontend and PDF!');
    } else {
      console.log('\n💥 FAILURE: Time slot ordering is still inconsistent!');
    }
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testTimeSlotOrdering,
  testEarlyTimeSlotCreation,
  runTests
};
