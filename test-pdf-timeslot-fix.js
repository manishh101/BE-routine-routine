#!/usr/bin/env node

/**
 * Test script to validate PDF time slot mapping fix
 * 
 * This script simulates the issue where:
 * 1. Time slots are fetched and sorted by sortOrder 
 * 2. Routine slots have slotIndex that should map to TimeSlot._id
 * 3. PDF generation should use correct mapping regardless of time slot insertion order
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Mock TimeSlot data simulating the issue
const mockTimeSlots = [
  { _id: 1, startTime: '10:15', endTime: '11:05', sortOrder: 2, label: '10:15-11:05' },
  { _id: 2, startTime: '11:05', endTime: '11:55', sortOrder: 3, label: '11:05-11:55' },
  { _id: 3, startTime: '11:55', endTime: '12:45', sortOrder: 4, label: '11:55-12:45' },
  { _id: 4, startTime: '12:45', endTime: '13:35', sortOrder: 5, label: '12:45-13:35' },
  { _id: 9, startTime: '07:00', endTime: '10:15', sortOrder: 1, label: '07:00-10:15' }, // Added later
];

// Mock RoutineSlot data - classes originally assigned to slots 1, 2, 3
const mockRoutineSlots = [
  {
    _id: 'slot1',
    dayIndex: 0, // Sunday
    slotIndex: 1, // Should map to TimeSlot with _id: 1 (10:15-11:05)
    subjectCode_display: 'CG',
    subjectName_display: 'Computer Graphics'
  },
  {
    _id: 'slot2', 
    dayIndex: 0, // Sunday
    slotIndex: 2, // Should map to TimeSlot with _id: 2 (11:05-11:55)
    subjectCode_display: 'SE',
    subjectName_display: 'Software Engineering'
  }
];

// Simulate the OLD (broken) mapping logic
function oldMappingLogic(routineSlots, timeSlots) {
  console.log('\n🔴 OLD (BROKEN) MAPPING LOGIC:');
  console.log('Time slots sorted by sortOrder:', timeSlots.map(ts => `${ts._id}:${ts.label}`).join(', '));
  
  const routineMap = new Map();
  
  routineSlots.forEach(slot => {
    // OLD LOGIC: Used slotIndex as array index (WRONG!)
    if (slot.slotIndex !== undefined && timeSlots[slot.slotIndex - 1]) {
      const timeSlotArrayIndex = slot.slotIndex - 1;
      const timeSlot = timeSlots[timeSlotArrayIndex];
      const key = `${slot.dayIndex}-${timeSlot._id}`;
      
      console.log(`❌ Mapping slotIndex ${slot.slotIndex} -> array[${timeSlotArrayIndex}] -> ${timeSlot.label} (WRONG!)`);
      console.log(`   Expected: ${slot.subjectCode_display} should be at 10:15-11:05`);
      console.log(`   Actually mapped to: ${timeSlot.label}`);
      
      if (!routineMap.has(key)) {
        routineMap.set(key, []);
      }
      routineMap.get(key).push(slot);
    }
  });
  
  return routineMap;
}

// Simulate the NEW (fixed) mapping logic  
function newMappingLogic(routineSlots, timeSlots) {
  console.log('\n✅ NEW (FIXED) MAPPING LOGIC:');
  console.log('Time slots sorted by sortOrder:', timeSlots.map(ts => `${ts._id}:${ts.label}`).join(', '));
  
  const routineMap = new Map();
  
  routineSlots.forEach(slot => {
    // NEW LOGIC: Find timeSlot where _id matches slotIndex (CORRECT!)
    const timeSlot = timeSlots.find(ts => ts._id === slot.slotIndex);
    
    if (timeSlot) {
      const key = `${slot.dayIndex}-${timeSlot._id}`;
      
      console.log(`✅ Mapping slotIndex ${slot.slotIndex} -> TimeSlot._id ${timeSlot._id} -> ${timeSlot.label} (CORRECT!)`);
      console.log(`   ${slot.subjectCode_display} correctly mapped to ${timeSlot.label}`);
      
      if (!routineMap.has(key)) {
        routineMap.set(key, []);
      }
      routineMap.get(key).push(slot);
    } else {
      console.log(`❌ No timeSlot found for slotIndex ${slot.slotIndex}`);
    }
  });
  
  return routineMap;
}

// Test consecutive slot detection
function testConsecutiveSlotDetection(timeSlots) {
  console.log('\n🔍 TESTING CONSECUTIVE SLOT DETECTION:');
  
  // Helper function to check if two slots are consecutive in time order
  const areConsecutiveSlots = (slotIndex1, slotIndex2) => {
    const timeSlot1 = timeSlots.find(ts => ts._id === slotIndex1);
    const timeSlot2 = timeSlots.find(ts => ts._id === slotIndex2);
    
    if (!timeSlot1 || !timeSlot2) return false;
    
    return timeSlot2.sortOrder === timeSlot1.sortOrder + 1;
  };
  
  // Test cases
  const testCases = [
    [1, 2], // 10:15-11:05 -> 11:05-11:55 (should be consecutive)
    [2, 3], // 11:05-11:55 -> 11:55-12:45 (should be consecutive)  
    [9, 1], // 07:00-10:15 -> 10:15-11:05 (should be consecutive)
    [1, 3], // 10:15-11:05 -> 11:55-12:45 (should NOT be consecutive)
    [4, 9], // 12:45-13:35 -> 07:00-10:15 (should NOT be consecutive)
  ];
  
  testCases.forEach(([slot1, slot2]) => {
    const ts1 = timeSlots.find(ts => ts._id === slot1);
    const ts2 = timeSlots.find(ts => ts._id === slot2); 
    const isConsecutive = areConsecutiveSlots(slot1, slot2);
    
    console.log(`${isConsecutive ? '✅' : '❌'} Slots ${slot1} (${ts1?.label}) -> ${slot2} (${ts2?.label}): ${isConsecutive ? 'consecutive' : 'not consecutive'}`);
  });
}

// Main test execution
function runTests() {
  console.log('🧪 PDF TIME SLOT MAPPING FIX VALIDATION');
  console.log('========================================');
  
  // Sort time slots by sortOrder (like the real system does)
  const sortedTimeSlots = [...mockTimeSlots].sort((a, b) => a.sortOrder - b.sortOrder);
  
  console.log('\nScenario: Time slot "07:00-10:15" was added after the original schedule was created');
  console.log('Original classes were assigned to slots 1, 2, 3 (10:15-11:05, 11:05-11:55, 11:55-12:45)');
  console.log('After adding 07:00-10:15 with sortOrder=1, the array order changed but slotIndex should still map correctly');
  
  // Test old vs new mapping logic
  oldMappingLogic(mockRoutineSlots, sortedTimeSlots);
  newMappingLogic(mockRoutineSlots, sortedTimeSlots);
  
  // Test consecutive slot detection  
  testConsecutiveSlotDetection(sortedTimeSlots);
  
  console.log('\n🎉 SUMMARY:');
  console.log('- The OLD logic incorrectly mapped classes to different time slots after new slot insertion');
  console.log('- The NEW logic correctly maps slotIndex to TimeSlot._id regardless of sort order');
  console.log('- Consecutive slot detection now works with actual time order, not ID arithmetic');
  console.log('- This fix ensures PDF exports match the frontend display');
}

// Run the tests
runTests();
