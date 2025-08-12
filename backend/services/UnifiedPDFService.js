const PDFDocument = require('pdfkit');
const RoutineSlot = require('../models/RoutineSlot');
const TimeSlot = require('../models/TimeSlot');
const Program = require('../models/Program');
const Teacher = require('../models/Teacher');
const Room = require('../models/Room');
const { getLabGroupsForSection, getSectionLabGroupLabel } = require('../utils/sectionUtils');
const { processRoutineSlots, processMultiGroupClasses } = require('../utils/routineDataProcessor');

/**
 * Unified PDF Service - Consolidated from multiple PDF services
 * Fixes time slot mapping bug and removes code duplication
 */
class UnifiedPDFService {
  constructor() {
    // PDF layout configuration
    this.headerRowHeight = 65;
    this.colors = {
      primary: '#667EEA',
      secondary: '#764BA2',
      text: '#333333',
      lightText: '#666666',
      border: '#c0c0c0',
      background: '#ffffff',
      headerBg: '#f8f9fa',
      breakBg: '#f5f5f5'
    };
    this.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  }

  /**
   * Get semester numbers for a given semester group (odd/even)
   */
  _getSemestersForGroup(semesterGroup) {
    if (semesterGroup === 'odd') {
      return [1, 3, 5, 7];
    } else if (semesterGroup === 'even') {
      return [2, 4, 6, 8];
    }
    return [];
  }

  /**
   * Get custom PDF page dimensions based on type
   */
  _getCustomPageSize(type = 'default') {
    const sizes = {
      'default': [1400, 842],
      'wide': [1200, 842],
      'tall': [1600, 842],
      'large': [1000, 1600],
      'a4': [595, 842],
      'a3': [1191, 842]
    };
    return sizes[type] || sizes['default'];
  }

  /**
   * Determine optimal page size based on content complexity
   */
  _getOptimalPageSize(routineSlots, timeSlots) {
    return 'a4'; // Force A4 for consistency
  }

  /**
   * FIXED: Create routine lookup map using correct time slot mapping
   * This fixes the critical bug where slotIndex was used as array index instead of TimeSlot._id
   */
  _createRoutineMap(routineSlots, timeSlots) {
    const routineMap = new Map();
    let mappedCount = 0;
    let errorCount = 0;

    console.log('🗺️ Creating routine mapping with FIXED time slot logic...');
    
    routineSlots.forEach(slot => {
      // CRITICAL FIX: Map slotIndex to TimeSlot._id, not array index
      const timeSlot = timeSlots.find(ts => ts._id.toString() === slot.slotIndex.toString());
      
      if (timeSlot) {
        const key = `${slot.dayIndex}-${timeSlot._id.toString()}`;
        
        if (!routineMap.has(key)) {
          routineMap.set(key, []);
        }
        routineMap.get(key).push(slot);
        mappedCount++;
        
        // Log successful mapping (limit output to avoid spam)
        if (mappedCount <= 3) {
          console.log(`  ✅ Fixed mapping: slotIndex ${slot.slotIndex} -> TimeSlot._id ${timeSlot._id} -> ${timeSlot.startTime}-${timeSlot.endTime}`);
        }
      } else {
        console.warn(`  ❌ No TimeSlot found for slotIndex ${slot.slotIndex}`);
        errorCount++;
      }
    });

    console.log(`📊 Fixed mapping completed: ${mappedCount}/${routineSlots.length} slots mapped successfully, ${errorCount} errors`);
    
    return routineMap;
  }

  /**
   * UNIFIED: Single fillRoutineData method with fixed time slot mapping
   * Replaces all duplicate implementations across different services
   */
  fillRoutineData(doc, routineSlots, timeSlots, pdfType = 'class', roomName = null, teacherName = null) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    console.log(`🔄 Starting UNIFIED PDF generation for ${pdfType} with FIXED time slot mapping...`);
    console.log(`TimeSlots: ${timeSlots.length}, RoutineSlots: ${routineSlots.length}`);
    
    // DEBUG: Log all time slots being used for PDF generation
    console.log(`📋 Time slots for PDF generation:`);
    timeSlots.forEach((slot, index) => {
      console.log(`  ${index}: ID=${slot._id}, Label="${slot.label}", Start="${slot.startTime}", End="${slot.endTime}", Sort=${slot.sortOrder}, Global=${slot.isGlobal}`);
    });
    
    // Grid dimensions - optimized for A4 landscape
    const startX = doc.page.margins.left;
    const startY = doc.y;
    const totalWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    
    const dayColumnWidth = 55;
    const timeColumnWidth = (totalWidth - dayColumnWidth) / timeSlots.length;
    const headerRowHeight = 20;
    const rowHeight = 60;

    // FIXED: Create routine lookup map using correct time slot mapping
    const routineMap = this._createRoutineMap(routineSlots, timeSlots);

    // Step 1: Detect spanning classes
    const spanningClasses = this._detectSpanningClasses(routineSlots, timeSlots, days);

    // Step 2: Draw header row with consistent 8.5pt font size
    doc.fontSize(8.5).font('Helvetica-Bold'); // Same size as content
    this._drawCell(doc, startX, startY, dayColumnWidth, headerRowHeight, '', '#f0f0f0', true);
    
    timeSlots.forEach((timeSlot, index) => {
      const x = startX + dayColumnWidth + (index * timeColumnWidth);
      const headerText = timeSlot.isBreak ? 'BREAK' : `${timeSlot.startTime}-${timeSlot.endTime}`;
      this._drawCell(doc, x, startY, timeColumnWidth, headerRowHeight, headerText, '#f0f0f0', true);
    });

    // Step 3: Draw day rows
    days.forEach((day, dayIndex) => {
      const y = startY + headerRowHeight + (dayIndex * rowHeight);
      
      // Day name cell with consistent 8.5pt font size
      doc.fontSize(8.5).font('Helvetica-Bold'); // Same size as content
      this._drawCell(doc, startX, y, dayColumnWidth, rowHeight, day, '#f8f8f8', true);
      
      // Time slot cells for this day
      const daySpans = spanningClasses.get(dayIndex);
      const drawnCells = new Set();
      
      timeSlots.forEach((timeSlot, slotIndex) => {
        const x = startX + dayColumnWidth + (slotIndex * timeColumnWidth);
        const key = `${dayIndex}-${timeSlot._id.toString()}`;
        const slotsInCell = routineMap.get(key) || [];
        const currentSlotIndex = slotIndex + 1;
        const currentSortOrder = timeSlot.sortOrder || currentSlotIndex;
        
        if (drawnCells.has(slotIndex)) {
          return;
        }
        
        // Check for spanning classes - FIXED: Use proper slot order matching
        let spanInfo = null;
        if (daySpans) {
          // FIXED: Match spans using timeSlot.sortOrder instead of slotIndex + 1
          spanInfo = daySpans.spans.find(span => 
            currentSortOrder >= span.startSlot && currentSortOrder <= span.endSlot
          );
        }
        
        let cellContent = '';
        let bgColor = '#ffffff';
        let isLab = false;
        let cellWidth = timeColumnWidth;
        
        // Handle spanning classes - FIXED: Use proper sortOrder matching with improved boundary handling
        if (spanInfo && currentSortOrder === spanInfo.startSlot) {
          // FIXED: Calculate span length with proper boundary checking for end-of-schedule spans
          const maxAvailableSlot = Math.max(...timeSlots.map(ts => ts.sortOrder || 0));
          const maxAllowedEndSlot = Math.min(spanInfo.endSlot, maxAvailableSlot);
          const spanLength = maxAllowedEndSlot - spanInfo.startSlot + 1;
          
          // FIXED: Calculate remaining slots based on sortOrder, not array index
          const remainingSlotsFromCurrent = timeSlots.filter(ts => 
            (ts.sortOrder || 0) >= currentSortOrder
          ).length;
          const actualSpanLength = Math.min(spanLength, remainingSlotsFromCurrent);
          
          cellWidth = timeColumnWidth * actualSpanLength;
          
          console.log(`📏 Drawing span ${spanInfo.startSlot}-${spanInfo.endSlot}: actualLength=${actualSpanLength}, width=${cellWidth}`);
          
          // FIXED: Mark cells as drawn based on sortOrder, not index
          timeSlots.forEach((ts, tsIndex) => {
            if (ts.sortOrder >= spanInfo.startSlot && ts.sortOrder <= Math.min(spanInfo.endSlot, maxAvailableSlot)) {
              drawnCells.add(tsIndex);
            }
          });
          
          if (spanInfo.type === 'practical-group') {
            console.log(`📏 Drawing practical group spanning: ${spanInfo.startSlot}-${maxAllowedEndSlot} (length: ${actualSpanLength})`);
            cellContent = this._formatSpanningContent(spanInfo, pdfType);
            isLab = true;
          } else {
            cellContent = this._formatSpanningContent(spanInfo, pdfType);
            isLab = spanInfo.slots[0]?.classType === 'P';
          }
        }
        // Handle regular cells with multi-group support
        else if (!spanInfo) {
          if (slotsInCell.length > 0) {
            // Process multi-group classes (e.g., practical labs with Group A and Group B)
            const processedSlots = this._processMultiGroupSlots(slotsInCell);
            
            if (processedSlots.isMultiGroup) {
              cellContent = this._formatMultiGroupContent(processedSlots, pdfType, roomName, teacherName);
              isLab = processedSlots.groups[0]?.classType === 'P';
            } else {
              const slot = slotsInCell[0];
              isLab = slot.classType === 'P';
              cellContent = this._formatCellContent(slot, pdfType, roomName, teacherName);
            }
          }
        }
        
        if (cellContent !== '' || !spanInfo) {
          this._drawCell(doc, x, y, cellWidth, rowHeight, cellContent, bgColor, false, isLab);
        }
      });
    });
    
    console.log('✅ UNIFIED PDF generation with FIXED time slot mapping completed');
  }

  /**
   * Detect spanning classes using fixed time slot logic
   * Enhanced with practical group detection from PDFRoutineService_OLD.js
   */
  _detectSpanningClasses(routineSlots, timeSlots, days) {
    const spanningClasses = new Map();
    
    console.log('🔍 Enhanced spanning class detection with practical group support...');
    
    days.forEach((day, dayIndex) => {
      const daySlots = routineSlots.filter(slot => slot.dayIndex === dayIndex)
                                   .sort((a, b) => {
                                     // FIXED: Sort by actual time order, not slotIndex
                                     const timeSlotA = timeSlots.find(ts => ts._id.toString() === a.slotIndex.toString());
                                     const timeSlotB = timeSlots.find(ts => ts._id.toString() === b.slotIndex.toString());
                                     return (timeSlotA?.sortOrder || 0) - (timeSlotB?.sortOrder || 0);
                                   });
      
      if (daySlots.length === 0) return;
      
      // Enhanced: Group slots by slotIndex to find practical class groups (from OLD service)
      const slotGroups = new Map();
      daySlots.forEach(slot => {
        const timeSlot = timeSlots.find(ts => ts._id.toString() === slot.slotIndex.toString());
        const slotOrder = timeSlot?.sortOrder || 0;
        
        if (!slotGroups.has(slotOrder)) {
          slotGroups.set(slotOrder, []);
        }
        slotGroups.get(slotOrder).push(slot);
      });
      
      // Enhanced: Find consecutive practical class groups (from OLD service)
      const practicalGroups = [];
      let currentPracticalGroup = null;
      
      // Get maximum slot order to prevent boundary overflow
      const maxSlotOrder = Math.max(...timeSlots.map(ts => ts.sortOrder || 0));
      
      for (const [slotOrder, slotsInSlot] of slotGroups.entries()) {
        // FIXED: Skip if slot order exceeds available time slots
        if (slotOrder > maxSlotOrder) {
          continue;
        }
        
        const hasPractical = slotsInSlot.some(slot => slot.classType === 'P');
        const hasMultipleSubjects = slotsInSlot.length > 1;
        
        // Detect practical groups: either multiple subjects OR single practical classes
        if (hasPractical) {
          if (!currentPracticalGroup) {
            currentPracticalGroup = {
              startSlot: slotOrder,
              endSlot: Math.min(slotOrder, maxSlotOrder), // Bound end slot
              slots: [...slotsInSlot],
              type: 'practical-group'
            };
          } else if (slotOrder === currentPracticalGroup.endSlot + 1 && slotOrder <= maxSlotOrder) {
            // Check if this continues the same practical class or is a new one
            const currentSubjects = currentPracticalGroup.slots.map(s => s.subjectId?.code || s.subjectCode_display).filter(Boolean);
            const newSubjects = slotsInSlot.map(s => s.subjectId?.code || s.subjectCode_display).filter(Boolean);
            
            // Continue if it's consecutive AND (same subjects OR both are practical)
            const hasSameSubjects = currentSubjects.some(cs => newSubjects.includes(cs));
            
            if (hasSameSubjects || hasMultipleSubjects || currentPracticalGroup.slots.length === 1) {
              // Continue practical group with boundary check
              currentPracticalGroup.endSlot = Math.min(slotOrder, maxSlotOrder);
              currentPracticalGroup.slots.push(...slotsInSlot);
            } else {
              // End current group and start new one
              practicalGroups.push(currentPracticalGroup);
              currentPracticalGroup = {
                startSlot: slotOrder,
                endSlot: Math.min(slotOrder, maxSlotOrder),
                slots: [...slotsInSlot],
                type: 'practical-group'
              };
            }
          } else {
            // End current group and start new one (non-consecutive or beyond boundary)
            practicalGroups.push(currentPracticalGroup);
            currentPracticalGroup = {
              startSlot: slotOrder,
              endSlot: Math.min(slotOrder, maxSlotOrder),
              slots: [...slotsInSlot],
              type: 'practical-group'
            };
          }
        } else {
          // End current practical group if exists
          if (currentPracticalGroup) {
            practicalGroups.push(currentPracticalGroup);
            currentPracticalGroup = null;
          }
        }
      }
      
      // Add final practical group if exists
      if (currentPracticalGroup) {
        practicalGroups.push(currentPracticalGroup);
      }
      
      // Create a set of slots that are part of practical groups to avoid duplicate spans
      const practicalGroupSlots = new Set();
      practicalGroups.forEach(group => {
        for (let i = group.startSlot; i <= group.endSlot; i++) {
          practicalGroupSlots.add(i);
        }
      });
      
      const spans = [];
      let currentSpan = null;
      
      // FIXED: Standard spanning class detection using sortOrder-based consecutive logic
      const sortedSlots = [...daySlots].sort((a, b) => {
        const timeSlotA = timeSlots.find(ts => ts._id.toString() === a.slotIndex.toString());
        const timeSlotB = timeSlots.find(ts => ts._id.toString() === b.slotIndex.toString());
        return (timeSlotA?.sortOrder || 0) - (timeSlotB?.sortOrder || 0);
      });
      
      sortedSlots.forEach((slot, index) => {
        if (slot.classType === 'BREAK') {
          if (currentSpan) {
            spans.push(currentSpan);
            currentSpan = null;
          }
          return;
        }
        
        const timeSlot = timeSlots.find(ts => ts._id.toString() === slot.slotIndex.toString());
        const slotOrder = timeSlot?.sortOrder || 0;
        
        // Skip slots that are part of practical groups
        if (practicalGroupSlots.has(slotOrder)) {
          if (currentSpan) {
            spans.push(currentSpan);
            currentSpan = null;
          }
          return;
        }
        
        const subjectIdentifier = slot.subjectId?.code || slot.subjectCode_display || 'N/A';
        
        if (!currentSpan) {
          currentSpan = {
            startSlot: slotOrder,
            endSlot: Math.min(slotOrder, maxSlotOrder),
            subject: subjectIdentifier,
            classType: slot.classType,
            slots: [slot],
            type: 'subject-span'
          };
        } else if (currentSpan.subject === subjectIdentifier && 
                   currentSpan.classType === slot.classType &&
                   slotOrder === currentSpan.endSlot + 1 &&
                   slotOrder <= maxSlotOrder) {
          // FIXED: Continue span only for truly consecutive slots
          currentSpan.endSlot = Math.min(slotOrder, maxSlotOrder);
          currentSpan.slots.push(slot);
        } else {
          // End current span and start new one
          if (currentSpan.endSlot > currentSpan.startSlot) {
            spans.push(currentSpan); // Only add spans that actually span multiple slots
          }
          currentSpan = {
            startSlot: slotOrder,
            endSlot: Math.min(slotOrder, maxSlotOrder),
            subject: subjectIdentifier,
            classType: slot.classType,
            slots: [slot],
            type: 'subject-span'
          };
        }
        
        // Add final span if it spans multiple slots
        if (index === sortedSlots.length - 1 && currentSpan && currentSpan.endSlot > currentSpan.startSlot) {
          spans.push(currentSpan);
        }
      });
      
      // Combine both types of spans (enhanced from OLD service)
      const allSpans = [...spans.filter(span => span.endSlot >= span.startSlot), ...practicalGroups.filter(group => group.endSlot >= group.startSlot)];
      
      if (allSpans.length > 0) {
        spanningClasses.set(dayIndex, { spans: allSpans });
        console.log(`📏 ${day} enhanced spanning classes:`, allSpans.map(s => {
          if (s.type === 'practical-group') {
            const subjects = [...new Set(s.slots.map(slot => slot.subjectId?.code || slot.subjectCode_display || 'N/A'))];
            return `Practical Group [${subjects.join(', ')}] spans slots ${s.startSlot}-${s.endSlot}`;
          } else {
            return `${s.subject} [${s.classType}] spans slots ${s.startSlot}-${s.endSlot}`;
          }
        }));
      }
    });
    
    return spanningClasses;
  }

  /**
   * Format spanning content based on PDF type
   * Enhanced to handle practical groups from PDFRoutineService_OLD.js
   */
  _formatSpanningContent(span, pdfType) {
    if (span.type === 'practical-group') {
      // Enhanced practical group formatting (from OLD service)
      return this._formatPracticalGroupSpanning(span, pdfType);
    }
    
    // Standard subject spanning
    const firstSlot = span.slots[0];
    const subjectName = firstSlot.subjectName_display || firstSlot.subjectId?.name || 'N/A';
    const classType = this._getClassTypeText(firstSlot.classType);
    
    const teacherNames = pdfType === 'teacher' ? '' : (
      firstSlot.teacherShortNames_display?.join(', ') || 
      firstSlot.teacherIds?.map(t => t.shortName).filter(Boolean).join(', ') || 'TBA'
    );
    
    const roomName = pdfType === 'room' ? '' : (
      firstSlot.classType === 'P' ? (
        firstSlot.roomName_display || 
        firstSlot.roomId?.name || 'TBA'
      ) : ''
    );
    
    // Enhanced lab group indicator with section awareness (from OLD service)
    let labGroupIndicator = '';
    if ((firstSlot.classType === 'P' || firstSlot.isAlternativeWeek === true) && firstSlot.labGroup && firstSlot.labGroup !== 'ALL') {
      labGroupIndicator = `(Group ${firstSlot.labGroup}) `;
    }
    
    if (pdfType === 'teacher') {
      return roomName ? `${labGroupIndicator}${subjectName} [${classType}]\n${roomName}` : `${labGroupIndicator}${subjectName} [${classType}]`;
    } else if (pdfType === 'room') {
      const section = `${firstSlot.programCode}-${firstSlot.semester}${firstSlot.section}`;
      return teacherNames ? `${section}\n${labGroupIndicator}${subjectName} [${classType}]\n${teacherNames}` : `${section}\n${labGroupIndicator}${subjectName} [${classType}]`;
    } else {
      if (firstSlot.classType === 'P') {
        return roomName ? `${labGroupIndicator}${subjectName} [${classType}]\n${teacherNames} | ${roomName}` : `${labGroupIndicator}${subjectName} [${classType}]\n${teacherNames}`;
      } else {
        return `${labGroupIndicator}${subjectName} [${classType}]\n${teacherNames}`;
      }
    }
  }

  /**
   * Format practical group spanning content (from PDFRoutineService_OLD.js)
   * Handles spanning practical classes with multiple groups and subjects
   */
  _formatPracticalGroupSpanning(practicalGroup, pdfType = 'class') {
    // Helper function to get unique entities by ID
    const getUniqueEntities = (slots, entityAccessor, idExtractor, valueExtractor) => {
      const entityMap = new Map();
      
      slots.forEach(slot => {
        const entities = entityAccessor(slot);
        if (!entities) return;
        
        if (Array.isArray(entities)) {
          entities.forEach(entity => {
            if (!entity) return;
            const id = idExtractor(entity);
            const value = valueExtractor(entity);
            if (id && value) {
              entityMap.set(id.toString(), value);
            }
          });
        } else {
          const id = idExtractor(entities);
          const value = valueExtractor(entities);
          if (id && value) {
            entityMap.set(id.toString(), value);
          }
        }
      });
      
      return [...entityMap.values()];
    };

    // Group slots by subject (not by subject+group) to properly merge multi-group classes
    const subjectGroups = new Map();
    
    practicalGroup.slots.forEach((slot) => {
      // Enhanced room name extraction for better compatibility
      let roomName = slot.roomName_display || 
                    slot.roomId?.name || 
                    slot.display?.roomName || 
                    slot.room?.name ||
                    slot.roomName ||
                    'TBA';
      
      // Additional fallback for different data structures
      if (!roomName || roomName === 'TBA') {
        if (typeof slot.roomId === 'string') {
          roomName = slot.roomId;
        } else if (slot.room && typeof slot.room === 'string') {
          roomName = slot.room;
        }
      }
      
      // Group by subject only (not by subject+group) to enable proper merging
      const subjectCode = slot.subjectId?.code || slot.subjectCode_display || 'N/A';
      const section = slot.section || 'AB';
      
      if (!subjectGroups.has(subjectCode)) {
        subjectGroups.set(subjectCode, {
          subjectCode: subjectCode,
          subjectName: slot.subjectName_display || slot.subjectId?.name || slot.display?.subjectName || 'N/A',
          classType: slot.classType,
          section: section,
          groups: []
        });
      }
      
      // Enhanced lab group labeling with section awareness
      const labGroup = slot.labGroup || 'ALL';
      let enhancedLabGroup = '';
      if (labGroup && labGroup !== 'ALL') {
        enhancedLabGroup = labGroup;
      }
      
      // Add this group to the subject
      subjectGroups.get(subjectCode).groups.push({
        labGroup: enhancedLabGroup,
        originalLabGroup: labGroup,
        teacher: pdfType === 'teacher' ? '' : (
          slot.teacherShortNames_display?.join(', ') || 
          slot.teacherIds?.map(t => t.shortName).filter(Boolean).join(', ') || 
          slot.display?.teacherShortNames?.join(', ') || 
          slot.teacherId?.name || slot.teacherName_display || 'TBA'
        ),
        room: pdfType === 'room' ? '' : (slot.classType === 'P' ? roomName : ''),
        programCode: slot.programCode,
        semester: slot.semester,
        slot: slot
      });
    });
    
    // Format each subject with its groups properly merged
    const formattedSubjects = Array.from(subjectGroups.values()).map(subject => {
      const classType = this._getClassTypeText(subject.classType);
      
      // Get unique teachers and rooms for this subject
      const allSubjectSlots = subject.groups.map(g => g.slot);
      
      // Get unique teachers for this subject
      const uniqueTeachers = getUniqueEntities(
        allSubjectSlots,
        slot => slot.teacherIds,
        entity => entity._id,
        entity => entity.shortName || entity.fullName
      );
      
      // Get unique rooms for this subject
      const uniqueRooms = getUniqueEntities(
        allSubjectSlots,
        slot => slot.roomId,
        entity => entity._id,
        entity => entity.name
      );
      
      // Get unique lab groups
      const uniqueLabGroups = [...new Set(
        allSubjectSlots
          .filter(slot => slot.labGroup && slot.labGroup !== 'ALL')
          .map(slot => slot.labGroup)
      )].sort();
      
      // Sort groups by lab group for consistent A, B ordering
      const sortedGroups = subject.groups.sort((a, b) => {
        return (a.labGroup || '').localeCompare(b.labGroup || '');
      });
      
      if (sortedGroups.length === 1) {
        // Single group
        const group = sortedGroups[0];
        const labGroupInfo = group.labGroup ? `(Group ${group.labGroup}) ` : '';
        
        if (pdfType === 'teacher') {
          return group.room ? `${labGroupInfo}${subject.subjectName} [${classType}]\n${group.room}` : `${labGroupInfo}${subject.subjectName} [${classType}]`;
        } else if (pdfType === 'room') {
          const section = `${group.programCode}-${group.semester}${subject.section}`;
          const sectionTeacherLine = group.teacher ? `${section} | ${group.teacher}` : section;
          return `${labGroupInfo}${subject.subjectName} [${classType}]\n${sectionTeacherLine}`;
        } else {
          if (group.room) {
            return `${labGroupInfo}${subject.subjectName} [${classType}]\n${group.teacher} | ${group.room}`;
          } else {
            return `${labGroupInfo}${subject.subjectName} [${classType}]\n${group.teacher}`;
          }
        }
      } else {
        // Multiple groups - show as merged multi-group class
        const groupLabels = uniqueLabGroups.length > 0 
          ? uniqueLabGroups.map(g => `Group ${g}`).join(' & ')
          : 'Multiple Groups';
        
        if (pdfType === 'teacher') {
          const rooms = uniqueRooms.join(' / ');
          return rooms ? `(${groupLabels}) ${subject.subjectName} [${classType}]\n${rooms}` : `(${groupLabels}) ${subject.subjectName} [${classType}]`;
        } else if (pdfType === 'room') {
          const section = `${sortedGroups[0].programCode}-${sortedGroups[0].semester}${subject.section}`;
          const teachers = uniqueTeachers.join(' / ');
          const sectionTeacherLine = teachers ? `${section} | ${teachers}` : section;
          return `(${groupLabels}) ${subject.subjectName} [${classType}]\n${sectionTeacherLine}`;
        } else {
          const teachersLine = uniqueTeachers.join(', ');
          const roomsLine = uniqueRooms.join(', ');
          if (roomsLine) {
            return `(${groupLabels}) ${subject.subjectName} [${classType}]\n${teachersLine} | ${roomsLine}`;
          } else {
            return `(${groupLabels}) ${subject.subjectName} [${classType}]\n${teachersLine}`;
          }
        }
      }
    });
    
    return formattedSubjects.join('\n──────\n');
  }

  /**
   * Format single cell content based on PDF type
   * Enhanced with formatting from PDFRoutineService_OLD.js
   */
  _formatCellContent(slot, pdfType, roomName = null, teacherName = null) {
    if (slot.classType === 'BREAK') {
      return 'BREAK';
    }
    
    const subjectName = slot.subjectName_display || slot.subjectId?.name || 'N/A';
    const classType = this._getClassTypeText(slot.classType);
    
    const teacherNames = pdfType === 'teacher' ? '' : (
      slot.teacherShortNames_display?.join(', ') || 
      slot.teacherIds?.map(t => t.shortName).filter(Boolean).join(', ') || 'TBA'
    );
    
    // Enhanced room name extraction (from OLD service)
    const roomDisplayName = pdfType === 'room' ? '' : (
      slot.classType === 'P' ? (
        slot.roomName_display || 
        slot.roomId?.name || 
        slot.display?.roomName || 
        slot.room?.name ||
        slot.roomName ||
        slot.roomId ||
        'TBA'
      ) : ''
    );
    
    // Enhanced lab group indicator with section awareness (from OLD service)
    let labGroupIndicator = '';
    if ((slot.classType === 'P' || slot.isAlternativeWeek === true) && slot.labGroup && slot.labGroup !== 'ALL') {
      // Backend already stores correct group values (A,B for AB section; C,D for CD section)
      labGroupIndicator = ` (${slot.labGroup})`;
    }
    
    // ENHANCED: Intelligent text wrapping for better readability with larger fonts
    let wrappedSubjectName = subjectName;
    const maxLineLength = 20; // Adjusted for larger font sizes
    const fullSubjectText = subjectName + labGroupIndicator;
    
    if (fullSubjectText.length > maxLineLength) {
      const words = subjectName.split(' ');
      if (words.length >= 2) {
        // ENHANCED: Smart line breaking for multi-word subjects
        if (words.length === 2) {
          // Two words - put each on separate line
          wrappedSubjectName = words.join('\n');
        } else if (words.length === 3) {
          // Three words - try 2+1 or 1+2 split based on length
          const option1 = `${words[0]} ${words[1]}\n${words[2]}`;
          const option2 = `${words[0]}\n${words[1]} ${words[2]}`;
          const option1MaxLine = Math.max(words[0].length + words[1].length + 1, words[2].length);
          const option2MaxLine = Math.max(words[0].length, words[1].length + words[2].length + 1);
          wrappedSubjectName = option1MaxLine <= option2MaxLine ? option1 : option2;
        } else {
          // Four or more words - split roughly in half
          const midPoint = Math.ceil(words.length / 2);
          const firstLine = words.slice(0, midPoint).join(' ');
          const secondLine = words.slice(midPoint).join(' ');
          wrappedSubjectName = `${firstLine}\n${secondLine}`;
        }
      } else if (subjectName.includes('&')) {
        // Handle subjects with "&" by breaking at that point
        wrappedSubjectName = subjectName.replace(' & ', '\n& ');
      } else if (subjectName.includes('-')) {
        // Handle subjects with "-" by breaking at that point
        wrappedSubjectName = subjectName.replace(' - ', '\n- ');
      } else if (subjectName.includes(',')) {
        // Handle subjects with "," by breaking at that point
        wrappedSubjectName = subjectName.replace(', ', ',\n');
      } else if (subjectName.length > 25) {
        // Very long single word - break in middle
        const midPoint = Math.floor(subjectName.length / 2);
        // Try to break at a vowel or common letter
        let breakPoint = midPoint;
        for (let i = midPoint; i < Math.min(midPoint + 5, subjectName.length - 3); i++) {
          if ('aeiouAEIOU'.includes(subjectName[i])) {
            breakPoint = i + 1;
            break;
          }
        }
        wrappedSubjectName = `${subjectName.substring(0, breakPoint)}\n${subjectName.substring(breakPoint)}`;
      }
    }
    
    if (pdfType === 'teacher') {
      return roomDisplayName ? `${wrappedSubjectName}${labGroupIndicator} [${classType}]\n${roomDisplayName}` : `${wrappedSubjectName}${labGroupIndicator} [${classType}]`;
    } else if (pdfType === 'room') {
      const section = `${slot.programCode}-${slot.semester}${slot.section}`;
      if (slot.classType === 'P') {
        // Practical class: show section and teacher side by side
        const sectionTeacherLine = teacherNames ? `${section} | ${teacherNames}` : section;
        return `${wrappedSubjectName}${labGroupIndicator} [${classType}]\n${sectionTeacherLine}`;
      } else {
        // Lecture class: show section and teacher on separate lines
        return teacherNames ? `${section}\n${wrappedSubjectName}${labGroupIndicator} [${classType}]\n${teacherNames}` : `${section}\n${wrappedSubjectName}${labGroupIndicator} [${classType}]`;
      }
    } else {
      if (slot.classType === 'P') {
        // Practical class: Teacher | Room format for space efficiency
        return roomDisplayName ? `${wrappedSubjectName}${labGroupIndicator} [${classType}]\n${teacherNames} | ${roomDisplayName}` : `${wrappedSubjectName}${labGroupIndicator} [${classType}]\n${teacherNames}`;
      } else {
        // Lecture/Tutorial class: Only show teacher, no room
        return `${wrappedSubjectName}${labGroupIndicator} [${classType}]\n${teacherNames}`;
      }
    }
  }

  /**
   * Get class type text
   */
  _getClassTypeText(classType) {
    switch (classType) {
      case 'L': return 'L';
      case 'P': return 'P';
      case 'T': return 'T';
      case 'BREAK': return 'Break';
      default: return classType || 'N/A';
    }
  }

  /**
   * Draw a cell with content and support for horizontal separators
   * Enhanced with upward text positioning and better readability
   */
  _drawCell(doc, x, y, width, height, text, bgColor = '#ffffff', isHeader = false, isLab = false) {
    // Enhanced: Remove background colors for merged classes
    if (text && text.includes('──────')) {
      bgColor = '#ffffff'; // Use white background for merged classes
    }
    
    // Draw cell background with border
    doc.rect(x, y, width, height)
       .lineWidth(0.5)
       .fillAndStroke(bgColor, '#c0c0c0');
    
    if (text && text.trim()) {
      const lines = text.split('\n').filter(line => line.trim());
      const isMergedClass = text.includes('──────'); // Merged class separator
      const isMultiGroupClass = isMergedClass || 
                              (text && text.includes('Multiple Groups')) || 
                              (text && text.includes('Group A & Group B')) ||
                              (text && text.includes('Group C & Group D')) ||
                              (text && text.includes(' & ')) || // General pattern for joined groups
                              (text && /\(Group [A-D] & Group [A-D]\)/.test(text));
      
      // ENHANCED: Eye-friendly font sizing with larger text and smart auto-wrapping
      let fontSize;
      const textLength = text.length;
      const lineCount = lines.length;
      
      if (isHeader) {
        fontSize = 8.5; // Same size as content for complete consistency
      } else {
        // SIMPLIFIED: Single consistent font size for all content types
        fontSize = 8.5; // Single font size for all slots - consistent and readable
        
        // Only apply width scaling for very narrow or very wide cells
        const widthFactor = Math.max(0.9, Math.min(1.1, width / 80));
        fontSize = Math.max(4.5, fontSize * widthFactor);
      }
      
      const font = isHeader ? 'Helvetica-Bold' : (isLab ? 'Helvetica-Bold' : 'Helvetica');
      const textColor = '#333333'; // Use same color for all classes
      
      doc.fontSize(fontSize)
         .font(font)
         .fillColor(textColor);
      
      // ENHANCED: More generous line height for better readability
      const lineHeight = fontSize * (isMergedClass || isMultiGroupClass ? 1.25 : 1.3); // More spacious line spacing
      const totalTextHeight = lines.length * lineHeight;
      
      // ENHANCED: Smart vertical positioning - shift upward when space is limited
      let textStartY;
      const cellPadding = 4; // Increased padding for better visual breathing room
      const availableHeight = height - (cellPadding * 2);
      
      if (totalTextHeight <= availableHeight) {
        // Text fits comfortably - center it vertically with slight upward bias
        const verticalSpace = availableHeight - totalTextHeight;
        const upwardShift = Math.min(verticalSpace * 0.3, 3); // Shift up by 30% of extra space, max 3pt
        textStartY = y + cellPadding + (verticalSpace / 2) - upwardShift;
      } else {
        // Text is too tall - start from top with minimal padding and shift upward if needed
        const emergencyPadding = Math.max(1, cellPadding / 2); // Reduce padding when space is tight
        textStartY = y + emergencyPadding;
        
        // ENHANCED: Intelligent font reduction with upward positioning preference
        if (totalTextHeight > availableHeight) {
          const reductionFactor = Math.max(0.75, (availableHeight - 2) / totalTextHeight); // Ensure some margin
          fontSize *= reductionFactor;
          doc.fontSize(fontSize);
          
          // Recalculate with new font size and position text higher in cell
          const newLineHeight = fontSize * 1.2; // Tighter line spacing for cramped text
          const newTotalHeight = lines.length * newLineHeight;
          
          // Position text in upper portion of cell for better visibility
          const upperPortionY = y + Math.max(1, emergencyPadding);
          textStartY = upperPortionY;
          
          // If still too tall, position at very top of cell
          if (newTotalHeight > height - 2) {
            textStartY = y + 1;
          }
        }
      }
      
      // ENHANCED: Smart text rendering with upward positioning and centering
      lines.forEach((line, index) => {
        const lineY = textStartY + (index * lineHeight);
        
        // Enhanced boundary checking - allow text closer to edges for better space utilization
        if (lineY < y - 1 || lineY + fontSize > y + height + 1) {
          return;
        }
        
        if (line.trim() === '──────') {
          // Draw separator line
          const borderY = lineY + (fontSize * 0.4);
          if (borderY >= y + 1 && borderY <= y + height - 1) {
            doc.save();
            doc.strokeColor('#cccccc')
               .lineWidth(0.5)
               .moveTo(x + 5, borderY)
               .lineTo(x + width - 5, borderY)
               .stroke();
            doc.restore();
            doc.fillColor(textColor);
          }
        } else if (line.trim()) {
          // ENHANCED: Center text horizontally and ensure proper vertical positioning
          const textWidth = doc.widthOfString(line);
          const availableWidth = width - 4; // Leave small margins
          
          if (textWidth <= availableWidth) {
            // Text fits - center it
            const textX = x + Math.max(2, (width - textWidth) / 2);
            const adjustedY = Math.max(y + 1, Math.min(lineY, y + height - fontSize - 1));
            
            doc.text(line, textX, adjustedY);
          } else {
            // Text too wide - center it with clipping
            const adjustedY = Math.max(y + 1, Math.min(lineY, y + height - fontSize - 1));
            
            doc.text(line, x + 2, adjustedY, {
              width: availableWidth,
              height: fontSize + 2,
              align: 'center',
              ellipsis: false,
              lineBreak: false
            });
          }
        }
      });
      
      // Reset fill color
      doc.fillColor('#000000');
    }
  }

  /**
   * Generate PDF header
   */
  _generatePDFHeader(doc, options = {}) {
    const { programCode, programName, semester, section, title, subtitle, roomName, teacherName } = options;
    
    doc.moveDown(0.5);
    
    doc.fontSize(10).font('Helvetica-Bold')
       .text('Tribhuvan University', { align: 'center' });
    
    doc.moveDown(0.3);
    
    doc.fontSize(8).font('Helvetica-Bold')
       .text('Department of Electronics and Computer Engineering', { align: 'center' });
    
    doc.fontSize(6).font('Helvetica')
       .text('Pulchowk Campus, Institute of Engineering', { align: 'center' });
    
    doc.moveDown(0.3);
    
    if (title) {
      doc.fontSize(8).font('Helvetica-Bold')
         .text(title, { align: 'center' });
    } else if (programCode) {
      doc.fontSize(8).font('Helvetica-Bold')
         .text(`${programCode} - ${programName || 'Program'}`, { align: 'center' });
    }
    
    if (subtitle) {
      doc.fontSize(6).font('Helvetica')
         .text(subtitle, { align: 'center' });
    }
    
    doc.moveDown(0.5);
  }

  /**
   * Generate PDF footer (removed to save space)
   */
  _generatePDFFooter(doc, scheduleType) {
    // Footer removed to give more space to the routine grid
  }

  // ===============================
  // PUBLIC METHODS FOR EACH PDF TYPE
  // ===============================

  /**
   * Generate class schedule PDF
   */
  async generateClassSchedulePDF(programCode, semester, section) {
    try {
      console.log(`📄 Generating class schedule PDF for ${programCode}-${semester}-${section}`);
      
      // Get routine slots for this section
      const routineSlots = await RoutineSlot.find({
        programCode: programCode.toUpperCase(),
        semester: parseInt(semester),
        section: section.toUpperCase(),
        isActive: true
      })
        .populate('subjectId', 'name code')
        .populate('teacherIds', 'fullName shortName')
        .populate('roomId', 'name')
        .sort({ dayIndex: 1, slotIndex: 1 });

      if (!routineSlots || routineSlots.length === 0) {
        console.log(`No routine data found for ${programCode}-${semester}-${section}`);
        return null;
      }

      // DEBUG: For BCT-3-AB, show slot mapping details
      if (programCode === 'BCT' && semester == 3 && section === 'AB') {
        console.log(`🔍 BCT-3-AB DEBUG: Found ${routineSlots.length} routine slots:`);
        routineSlots.forEach(slot => {
          console.log(`  Day ${slot.dayIndex}, SlotIndex ${slot.slotIndex}: ${slot.subjectId?.name} (Group ${slot.labGroup})`);
        });
      }

      // Get time slots: Global time slots + Section-specific time slots
      const timeSlots = await TimeSlot.find({
        $or: [
          // Include global time slots (legacy and new)
          { isGlobal: true },
          { isGlobal: { $exists: false } }, // Legacy time slots without isGlobal field
          { isGlobal: null },
          // Include time slots specific to this exact program-semester-section
          {
            isGlobal: false,
            programCode: programCode.toUpperCase(),
            semester: parseInt(semester),
            section: section.toUpperCase()
          }
        ]
      }).sort({ sortOrder: 1 });

      if (!timeSlots || timeSlots.length === 0) {
        console.log(`No time slots found for ${programCode}-${semester}-${section}`);
        return null;
      }

      console.log(`📊 Time slot isolation: Found ${timeSlots.length} time slots (global + section-specific) for ${programCode}-${semester}-${section}`);

      // DEBUG: For BCT-3-AB, show time slot details and mapping
      if (programCode === 'BCT' && semester == 3 && section === 'AB') {
        console.log(`🔍 BCT-3-AB TIME SLOTS (${timeSlots.length} found):`);
        timeSlots.forEach(slot => {
          console.log(`  TimeSlot ID ${slot._id}: ${slot.label} (${slot.startTime}-${slot.endTime}) - Global: ${slot.isGlobal}, Sort: ${slot.sortOrder}`);
        });
        
        console.log(`🔧 BCT-3-AB SLOT MAPPING CHECK:`);
        const usedSlots = [...new Set(routineSlots.map(s => s.slotIndex))];
        usedSlots.forEach(slotIndex => {
          const timeSlot = timeSlots.find(ts => ts._id === slotIndex);
          if (timeSlot) {
            console.log(`  ✅ SlotIndex ${slotIndex} -> TimeSlot ${timeSlot.label} (${timeSlot.startTime}-${timeSlot.endTime})`);
          } else {
            console.log(`  ❌ SlotIndex ${slotIndex} -> NO MATCHING TIME SLOT FOUND!`);
          }
        });
      }

      const program = await Program.findOne({ code: programCode.toUpperCase() });
      const customSize = this._getCustomPageSize('a4');
      
      const doc = new PDFDocument({
        margin: 15,
        size: customSize,
        layout: 'landscape'
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));

      this._generatePDFHeader(doc, {
        programCode: programCode.toUpperCase(),
        programName: program?.name || programCode,
        semester: parseInt(semester),
        section: section.toUpperCase()
      });

      this.fillRoutineData(doc, routineSlots, timeSlots, 'class');

      this._generateTeacherMappingTable(doc, routineSlots);
      this._generatePDFFooter(doc, `${programCode.toUpperCase()} Semester ${semester} Section ${section.toUpperCase()}`);

      return new Promise((resolve) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          console.log(`✅ Class schedule PDF generated successfully (${pdfBuffer.length} bytes)`);
          resolve(pdfBuffer);
        });
        doc.end();
      });

    } catch (error) {
      console.error('❌ Error generating class schedule PDF:', error);
      throw error;
    }
  }

  /**
   * Generate teacher schedule PDF
   */
  async generateTeacherSchedulePDF(teacherId, teacherName, semesterFilter = 'all') {
    try {
      console.log(`📄 Generating teacher schedule PDF for ${teacherName || teacherId}`);

      const query = {
        teacherIds: teacherId,
        isActive: true
      };
      
      if (semesterFilter === 'even') {
        query.semester = { $in: [2, 4, 6, 8] };
      } else if (semesterFilter === 'odd') {
        query.semester = { $in: [1, 3, 5, 7] };
      }

      const routineSlots = await RoutineSlot.find(query)
        .populate('subjectId', 'name code')
        .populate('teacherIds', 'fullName shortName')
        .populate('roomId', 'name')
        .sort({ dayIndex: 1, slotIndex: 1 });

      if (!routineSlots || routineSlots.length === 0) {
        console.log(`No routine data found for teacher ${teacherName || teacherId}`);
        return null;
      }

      // FIXED: Get sections that teacher teaches in, then fetch relevant time slots
      const sectionsTeaching = [...new Set(routineSlots.map(slot => slot.section))];
      
      // Get time slots for all sections this teacher teaches in
      const sectionFilters = sectionsTeaching.map(sec => {
        const parts = sec.split('-');
        if (parts.length >= 3) {
          return {
            isGlobal: false,
            programCode: parts[0],
            semester: parseInt(parts[1]),
            section: parts[2].toUpperCase()
          };
        }
        return null;
      }).filter(Boolean);
      
      const timeSlots = await TimeSlot.find({
        $or: [
          // Include global time slots
          { isGlobal: true },
          { isGlobal: { $exists: false } }, // Legacy time slots
          { isGlobal: null },
          // Include time slots for sections this teacher teaches in
          ...sectionFilters
        ]
      }).sort({ sortOrder: 1 });
      const customSize = this._getCustomPageSize('a4');
      
      const doc = new PDFDocument({
        margin: 30,
        size: customSize,
        layout: 'landscape'
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));

      this._generatePDFHeader(doc, {
        title: `Teacher Schedule - ${teacherName || 'Teacher'}`,
        subtitle: `Weekly Schedule`,
        teacherName: teacherName
      });

      this.fillRoutineData(doc, routineSlots, timeSlots, 'teacher', null, teacherName);
      this._generatePDFFooter(doc, `Teacher Schedule - ${teacherName || 'Teacher'}`);

      return new Promise((resolve) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          console.log(`✅ Teacher schedule PDF generated successfully (${pdfBuffer.length} bytes)`);
          resolve(pdfBuffer);
        });
        doc.end();
      });

    } catch (error) {
      console.error('❌ Error generating teacher schedule PDF:', error);
      throw error;
    }
  }

  /**
   * Generate room schedule PDF
   */
  async generateRoomSchedulePDF(roomId, roomName, semesterFilter = 'all') {
    try {
      console.log(`📄 Generating room schedule PDF for ${roomName || roomId}`);

      const query = {
        roomId: roomId,
        isActive: true
      };
      
      if (semesterFilter === 'even') {
        query.semester = { $in: [2, 4, 6, 8] };
      } else if (semesterFilter === 'odd') {
        query.semester = { $in: [1, 3, 5, 7] };
      }

      const routineSlots = await RoutineSlot.find(query)
        .populate('subjectId', 'name code')
        .populate('teacherIds', 'fullName shortName')
        .sort({ dayIndex: 1, slotIndex: 1 });

      if (!routineSlots || routineSlots.length === 0) {
        console.log(`No routine data found for room ${roomName || roomId}`);
        return null;
      }

      // FIXED: Get sections using this room, then fetch relevant time slots
      const sectionsUsing = [...new Set(routineSlots.map(slot => slot.section))];
      
      // Get time slots for all sections using this room
      const sectionFilters = sectionsUsing.map(sec => {
        const parts = sec.split('-');
        if (parts.length >= 3) {
          return {
            isGlobal: false,
            programCode: parts[0],
            semester: parseInt(parts[1]),
            section: parts[2].toUpperCase()
          };
        }
        return null;
      }).filter(Boolean);
      
      const timeSlots = await TimeSlot.find({
        $or: [
          // Include global time slots
          { isGlobal: true },
          { isGlobal: { $exists: false } }, // Legacy time slots
          { isGlobal: null },
          // Include time slots for sections using this room
          ...sectionFilters
        ]
      }).sort({ sortOrder: 1 });
      const customSize = this._getCustomPageSize('a4');
      
      const doc = new PDFDocument({
        margin: 30,
        size: customSize,
        layout: 'landscape'
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));

      this._generatePDFHeader(doc, {
        title: `Room Schedule - ${roomName || 'Room'}`,
        subtitle: `Weekly Schedule`,
        roomName: roomName
      });

      this.fillRoutineData(doc, routineSlots, timeSlots, 'room', roomName);
      this._generatePDFFooter(doc, `Room Schedule - ${roomName || 'Room'}`);

      return new Promise((resolve) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          console.log(`✅ Room schedule PDF generated successfully (${pdfBuffer.length} bytes)`);
          resolve(pdfBuffer);
        });
        doc.end();
      });

    } catch (error) {
      console.error('❌ Error generating room schedule PDF:', error);
      throw error;
    }
  }

  /**
   * Generate combined PDF for all sections in a semester
   */
  async generateAllSemesterSchedulesPDF(programCode, semester) {
    try {
      console.log(`📄 Generating combined PDF for ${programCode} Semester ${semester} all sections`);

      const sections = await RoutineSlot.distinct('section', {
        programCode: programCode.toUpperCase(),
        semester: parseInt(semester),
        isActive: true
      });

      if (!sections || sections.length === 0) {
        console.log(`No sections found for ${programCode} Semester ${semester}`);
        return null;
      }

      // Get time slots for all sections in this semester
      const sectionFilters = sections.map(sec => ({
        isGlobal: false,
        programCode: programCode.toUpperCase(),
        semester: parseInt(semester),
        section: sec.toUpperCase()
      }));
      
      const timeSlots = await TimeSlot.find({
        $or: [
          // Include global time slots
          { isGlobal: true },
          { isGlobal: { $exists: false } }, // Legacy time slots
          { isGlobal: null },
          // Include time slots for all sections in this semester
          ...sectionFilters
        ]
      }).sort({ sortOrder: 1 });
      const customSize = this._getCustomPageSize('a4');
      
      const doc = new PDFDocument({
        margin: 30,
        size: customSize,
        layout: 'landscape'
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));

      let isFirstSection = true;

      for (const section of sections.sort()) {
        if (!isFirstSection) {
          doc.addPage();
        }
        isFirstSection = false;

        const routineSlots = await RoutineSlot.find({
          programCode: programCode.toUpperCase(),
          semester: parseInt(semester),
          section: section.toUpperCase(),
          isActive: true
        })
          .populate('subjectId', 'name code')
          .populate('teacherIds', 'fullName shortName')
          .populate('roomId', 'name')
          .sort({ dayIndex: 1, slotIndex: 1 });

        if (routineSlots.length === 0) {
          continue;
        }

        const program = await Program.findOne({ code: programCode.toUpperCase() });

        this._generatePDFHeader(doc, {
          programCode: programCode.toUpperCase(),
          programName: program?.name || programCode,
          semester: parseInt(semester),
          section: section.toUpperCase()
        });

        this.fillRoutineData(doc, routineSlots, timeSlots, 'class');
        this._generatePDFFooter(doc, `${programCode.toUpperCase()} Semester ${semester} Section ${section.toUpperCase()}`);
      }

      return new Promise((resolve) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          console.log(`✅ Combined PDF generated successfully (${pdfBuffer.length} bytes)`);
          resolve(pdfBuffer);
        });
        doc.end();
      });

    } catch (error) {
      console.error('❌ Error generating combined semester PDF:', error);
      throw error;
    }
  }

  /**
   * Generate combined PDF for all teachers schedules
   */
  async generateAllTeachersSchedulesPDF(semesterGroup = 'all') {
    try {
      console.log(`📄 Generating all teachers schedules PDF for semester group: ${semesterGroup}`);

      let routineFilter = { isActive: true };
      if (semesterGroup && semesterGroup !== 'all') {
        const semesters = this._getSemestersForGroup(semesterGroup);
        routineFilter.semester = { $in: semesters };
      }

      const teacherIds = await RoutineSlot.distinct('teacherIds', routineFilter);
      
      if (!teacherIds || teacherIds.length === 0) {
        console.log('No teachers with active schedule found');
        return null;
      }

      const teachers = await Teacher.find({ _id: { $in: teacherIds } }).sort({ fullName: 1 });

      if (!teachers || teachers.length === 0) {
        console.log('No teacher details found');
        return null;
      }

      // Get all time slots for teacher schedules (all sections they teach in)
      const allRoutineSlots = await RoutineSlot.find(routineFilter);
      const sectionsWithTeachers = [...new Set(allRoutineSlots.map(slot => slot.section))];
      
      const sectionFilters = sectionsWithTeachers.map(sec => {
        const parts = sec.split('-');
        if (parts.length >= 3) {
          return {
            isGlobal: false,
            programCode: parts[0],
            semester: parseInt(parts[1]),
            section: parts[2].toUpperCase()
          };
        }
        return null;
      }).filter(Boolean);
      
      const timeSlots = await TimeSlot.find({
        $or: [
          // Include global time slots
          { isGlobal: true },
          { isGlobal: { $exists: false } }, // Legacy time slots
          { isGlobal: null },
          // Include time slots for all sections where teachers teach
          ...sectionFilters
        ]
      }).sort({ sortOrder: 1 });
      const customSize = this._getCustomPageSize('a4');
      
      const doc = new PDFDocument({
        margin: 30,
        size: customSize,
        layout: 'landscape'
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));

      let isFirstTeacher = true;

      for (const teacher of teachers) {
        if (!isFirstTeacher) {
          doc.addPage();
        }
        isFirstTeacher = false;

        let teacherRoutineFilter = {
          teacherIds: teacher._id,
          isActive: true
        };
        if (semesterGroup && semesterGroup !== 'all') {
          const semesters = this._getSemestersForGroup(semesterGroup);
          teacherRoutineFilter.semester = { $in: semesters };
        }

        const routineSlots = await RoutineSlot.find(teacherRoutineFilter)
          .populate('subjectId', 'name code')
          .populate('teacherIds', 'fullName shortName')
          .populate('roomId', 'name')
          .sort({ dayIndex: 1, slotIndex: 1 });

        if (routineSlots.length === 0) {
          continue;
        }

        const groupSuffix = semesterGroup && semesterGroup !== 'all' ? ` (${semesterGroup.toUpperCase()} Semester)` : '';
        this._generatePDFHeader(doc, {
          title: `Teacher Schedule - ${teacher.fullName}${groupSuffix}`,
          subtitle: `Weekly Schedule`,
          teacherName: teacher.fullName
        });

        this.fillRoutineData(doc, routineSlots, timeSlots, 'teacher', null, teacher.fullName);
        this._generatePDFFooter(doc, `Teacher Schedule - ${teacher.fullName}`);
      }

      return new Promise((resolve) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          console.log(`✅ All teachers schedules PDF generated successfully (${pdfBuffer.length} bytes)`);
          resolve(pdfBuffer);
        });
        doc.end();
      });

    } catch (error) {
      console.error('❌ Error generating all teachers schedules PDF:', error);
      throw error;
    }
  }

  /**
   * Generate combined PDF for all rooms schedules
   */
  async generateAllRoomsSchedulePDF(semesterGroup = 'all') {
    try {
      console.log(`📄 Generating all rooms schedule PDF for semester group: ${semesterGroup}`);

      let routineFilter = { isActive: true };
      if (semesterGroup && semesterGroup !== 'all') {
        const semesters = this._getSemestersForGroup(semesterGroup);
        routineFilter.semester = { $in: semesters };
      }

      const roomIds = await RoutineSlot.distinct('roomId', routineFilter);
      
      if (!roomIds || roomIds.length === 0) {
        console.log('No rooms with active schedule found');
        return null;
      }

      const rooms = await Room.find({ _id: { $in: roomIds } }).sort({ name: 1 });

      if (!rooms || rooms.length === 0) {
        console.log('No room details found');
        return null;
      }

      const timeSlots = await TimeSlot.find().sort({ sortOrder: 1 });
      const customSize = this._getCustomPageSize('a4');
      
      const doc = new PDFDocument({
        margin: 30,
        size: customSize,
        layout: 'landscape'
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));

      let isFirstRoom = true;

      for (const room of rooms) {
        if (!isFirstRoom) {
          doc.addPage();
        }
        isFirstRoom = false;

        let roomRoutineFilter = {
          roomId: room._id,
          isActive: true
        };
        if (semesterGroup && semesterGroup !== 'all') {
          const semesters = this._getSemestersForGroup(semesterGroup);
          roomRoutineFilter.semester = { $in: semesters };
        }

        const routineSlots = await RoutineSlot.find(roomRoutineFilter)
          .populate('subjectId', 'name code')
          .populate('teacherIds', 'fullName shortName')
          .sort({ dayIndex: 1, slotIndex: 1 });

        if (routineSlots.length === 0) {
          continue;
        }

        const groupSuffix = semesterGroup && semesterGroup !== 'all' ? ` (${semesterGroup.toUpperCase()} Semester)` : '';
        this._generatePDFHeader(doc, {
          title: `Room Schedule - ${room.name}${groupSuffix}`,
          subtitle: `Weekly Schedule`,
          roomName: room.name
        });

        this.fillRoutineData(doc, routineSlots, timeSlots, 'room', room.name);
        this._generatePDFFooter(doc, `Room Schedule - ${room.name}`);
      }

      return new Promise((resolve) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          console.log(`✅ All rooms schedule PDF generated successfully (${pdfBuffer.length} bytes)`);
          resolve(pdfBuffer);
        });
        doc.end();
      });

    } catch (error) {
      console.error('❌ Error generating all rooms schedule PDF:', error);
      throw error;
    }
  }

  /**
   * Generate teacher code to name mapping table
   */
  _generateTeacherMappingTable(doc, routineSlots) {
    const teacherMap = new Map();
    
    routineSlots.forEach(slot => {
      if (slot.teacherIds && Array.isArray(slot.teacherIds)) {
        slot.teacherIds.forEach(teacher => {
          if (teacher.shortName && teacher.fullName) {
            teacherMap.set(teacher.shortName, teacher.fullName);
          }
        });
      }
    });

    if (teacherMap.size === 0) {
      return;
    }

    const sortedTeachers = Array.from(teacherMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const totalWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    
    const teachersPerColumn = 8;
    const columnCount = Math.ceil(sortedTeachers.length / teachersPerColumn);
    const columnWidth = 180;
    const totalTableWidth = columnCount * columnWidth;
    const rowHeight = 12;
    const tableHeight = Math.min(teachersPerColumn * rowHeight + 15, 120);
    
    const tableX = doc.page.margins.left + (totalWidth - totalTableWidth) / 2 + 200;
    const tableY = doc.y + 20;
    
    doc.rect(tableX, tableY, totalTableWidth, tableHeight)
       .fillAndStroke('#f8f9fa', '#cccccc');
    
    for (let col = 0; col < columnCount; col++) {
      const startIndex = col * teachersPerColumn;
      const endIndex = Math.min(startIndex + teachersPerColumn, sortedTeachers.length);
      const columnTeachers = sortedTeachers.slice(startIndex, endIndex);
      
      const colX = tableX + (col * columnWidth);
      
      if (col > 0) {
        doc.strokeColor('#cccccc')
           .lineWidth(0.5)
           .moveTo(colX, tableY)
           .lineTo(colX, tableY + tableHeight)
           .stroke();
      }
      
      columnTeachers.forEach(([code, name], rowIndex) => {
        const rowY = tableY + 5 + (rowIndex * rowHeight);
        
        const isEven = rowIndex % 2 === 0;
        if (!isEven) {
          doc.rect(colX, rowY - 2, columnWidth, rowHeight)
             .fillAndStroke('#ffffff', '#ffffff');
        }
        
        const teacherText = `${code} - ${name}`;
        
        doc.fontSize(6)
           .font('Helvetica')
           .fillColor('#000000')
           .text(teacherText, colX + 3, rowY, {
             width: columnWidth - 6,
             align: 'left'
           });
      });
    }
    
    doc.y = tableY + tableHeight + 15;
  }

  /**
   * Process multiple slots to create multi-group structure matching frontend logic
   * Enhanced with practical group detection from PDFRoutineService_OLD.js
   */
  _processMultiGroupSlots(slots) {
    console.log(`🔍 _processMultiGroupSlots called with ${slots.length} slots:`, 
      slots.map(s => ({ labGroup: s.labGroup, subject: s.subjectId?.name })));
    
    if (!slots || slots.length <= 1) {
      console.log(`⚠️ Not multi-group: ${slots.length} slots`);
      return { isMultiGroup: false, groups: slots };
    }

    // Enhanced: Group by subject (not by subject+group) to properly merge multi-group classes
    const subjectGroups = new Map();
    
    console.log('🔍 Enhanced practical group processing for merged classes...');
    
    slots.forEach((slot, index) => {
      // Enhanced room name extraction with multiple fallbacks (from OLD service)
      let roomName = slot.roomName_display || 
                    slot.roomId?.name || 
                    slot.display?.roomName || 
                    slot.room?.name ||
                    slot.roomName ||
                    'TBA';
      
      // Additional fallback for different data structures
      if (!roomName || roomName === 'TBA') {
        if (typeof slot.roomId === 'string') {
          roomName = slot.roomId;
        } else if (slot.room && typeof slot.room === 'string') {
          roomName = slot.room;
        }
      }
      
      console.log(`  Enhanced room extraction for ${slot.subjectId?.code} (Group ${slot.labGroup}): "${roomName}"`);
      
      // Group by subject only (not by subject+group) to enable proper merging
      const subjectCode = slot.subjectId?.code || slot.subjectCode_display || 'N/A';
      const section = slot.section || 'AB';
      
      if (!subjectGroups.has(subjectCode)) {
        subjectGroups.set(subjectCode, {
          subjectCode: subjectCode,
          subjectName: slot.subjectName_display || slot.subjectId?.name || slot.display?.subjectName || 'N/A',
          classType: slot.classType,
          section: section,
          groups: [] // Store different groups (A, B) for this subject
        });
      }
      
      // Enhanced lab group labeling with section awareness
      const labGroup = slot.labGroup || 'ALL';
      let enhancedLabGroup = '';
      if (labGroup && labGroup !== 'ALL') {
        // Backend already stores correct group values (A,B for AB section; C,D for CD section)
        enhancedLabGroup = labGroup;
      }
      
      // Add this group to the subject
      subjectGroups.get(subjectCode).groups.push({
        labGroup: enhancedLabGroup,
        originalLabGroup: labGroup,
        teacher: slot.teacherShortNames_display?.join(', ') || 
                slot.teacherIds?.map(t => t.shortName).filter(Boolean).join(', ') || 
                slot.display?.teacherShortNames?.join(', ') || 
                slot.teacherId?.name || slot.teacherName_display || 'TBA',
        room: slot.classType === 'P' ? roomName : '', // Only show room for practical classes
        programCode: slot.programCode,
        semester: slot.semester,
        slot: slot
      });
    });

    // Check if we have multiple groups in any subject (enhanced detection)
    const hasMultipleGroups = Array.from(subjectGroups.values()).some(subject => {
      const uniqueLabGroups = [...new Set(
        subject.groups
          .filter(group => group.labGroup && group.labGroup !== 'ALL')
          .map(group => group.labGroup)
      )];
      return uniqueLabGroups.length > 1;
    });

    if (hasMultipleGroups) {
      console.log(`✅ Enhanced multi-group structure detected with consolidated subjects`);
      
      // Create enhanced groups structure
      const enhancedGroups = Array.from(subjectGroups.values()).map(subject => {
        // Get unique entities by ID using helper function
        const getUniqueEntities = (slots, entityAccessor, idExtractor, valueExtractor) => {
          const entityMap = new Map();
          
          slots.forEach(slot => {
            const entities = entityAccessor(slot);
            if (!entities) return;
            
            if (Array.isArray(entities)) {
              entities.forEach(entity => {
                if (!entity) return;
                const id = idExtractor(entity);
                const value = valueExtractor(entity);
                if (id && value) {
                  entityMap.set(id.toString(), value);
                }
              });
            } else {
              const id = idExtractor(entities);
              const value = valueExtractor(entities);
              if (id && value) {
                entityMap.set(id.toString(), value);
              }
            }
          });
          
          return [...entityMap.values()];
        };

        const allSubjectSlots = subject.groups.map(g => g.slot);
        
        // Get unique teachers for this subject
        const uniqueTeachers = getUniqueEntities(
          allSubjectSlots,
          slot => slot.teacherIds,
          entity => entity._id,
          entity => entity.shortName || entity.fullName
        );
        
        // Get unique rooms for this subject
        const uniqueRooms = getUniqueEntities(
          allSubjectSlots,
          slot => slot.roomId,
          entity => entity._id,
          entity => entity.name
        );
        
        // Get unique lab groups
        const uniqueLabGroups = [...new Set(
          allSubjectSlots
            .filter(slot => slot.labGroup && slot.labGroup !== 'ALL')
            .map(slot => slot.labGroup)
        )].sort();

        return {
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,
          classType: subject.classType,
          labGroups: uniqueLabGroups, // Array of groups: ['A', 'B']
          teacherShortNames: uniqueTeachers,
          roomNames: uniqueRooms,
          programSemesterSection: `${subject.groups[0].programCode}-${subject.groups[0].semester}-${subject.section}`,
          isConsolidated: uniqueLabGroups.length > 1,
          _originalSlots: allSubjectSlots
        };
      });

      return {
        isMultiGroup: true,
        groups: enhancedGroups,
        subjectName: enhancedGroups[0].subjectName,
        classType: enhancedGroups[0].classType,
        isEnhanced: true // Flag to indicate enhanced processing
      };
    }

    // Fallback to original logic for backward compatibility
    const groupedByLabGroup = {};
    
    slots.forEach(slot => {
      const labGroup = slot.labGroup || 'ALL';
      if (!groupedByLabGroup[labGroup]) {
        groupedByLabGroup[labGroup] = [];
      }
      groupedByLabGroup[labGroup].push(slot);
    });

    const groupKeys = Object.keys(groupedByLabGroup);
    
    if (groupKeys.length > 1) {
      console.log(`✅ Standard multi-group structure with ${groupKeys.length} groups`);
      const groups = groupKeys.sort().map(groupKey => {
        const groupSlots = groupedByLabGroup[groupKey];
        const slot = groupSlots[0];
        
        return {
          subjectName: slot.subjectId?.name || 'Unknown Subject',
          subjectCode: slot.subjectId?.code || '',
          classType: slot.classType,
          labGroup: groupKey,
          teacherShortNames: slot.teacherIds?.map(t => 
            t.shortName || t.fullName?.split(' ').map(n => n[0]).join('.')
          ) || ['TBA'],
          roomName: slot.roomId?.name || 'TBA',
          programSemesterSection: `${slot.programCode}-${slot.semester}-${slot.section}`,
          _originalSlot: slot
        };
      });

      return {
        isMultiGroup: true,
        groups: groups,
        subjectName: groups[0].subjectName,
        classType: groups[0].classType
      };
    }

    return { isMultiGroup: false, groups: slots };
  }

  /**
   * Format multi-group content matching frontend visual structure exactly
   * Enhanced with sophisticated formatting from PDFRoutineService_OLD.js
   */
  _formatMultiGroupContent(processedSlots, pdfType, roomName = null, teacherName = null) {
    if (!processedSlots.isMultiGroup) {
      // Single group - format normally
      const slot = processedSlots.groups[0];
      return this._formatSingleSlotContent(slot, pdfType, roomName, teacherName);
    }

    // Enhanced multi-group - format with consolidated subjects (from OLD service)
    if (processedSlots.isEnhanced) {
      const { groups } = processedSlots;
      const formattedSubjects = [];

      groups.forEach(subject => {
        const classType = this._getClassTypeText(subject.classType);
        
        if (subject.isConsolidated) {
          // Multiple groups for same subject - show as merged multi-group class
          const groupLabels = subject.labGroups.length > 0 
            ? subject.labGroups.map(g => `Group ${g}`).join(' & ')
            : 'Multiple Groups';
          
          if (pdfType === 'teacher') {
            // Teacher PDF: Show subject with group info and rooms (only for practical classes)
            const rooms = subject.roomNames.join(' / ');
            const content = rooms ? `(${groupLabels}) ${subject.subjectName} [${classType}]\n${rooms}` : `(${groupLabels}) ${subject.subjectName} [${classType}]`;
            formattedSubjects.push(content);
          } else if (pdfType === 'room') {
            // Room PDF: Show subject with group info and teachers with section
            const teachers = subject.teacherShortNames.join(' / ');
            const sectionTeacherLine = teachers ? `${subject.programSemesterSection} | ${teachers}` : subject.programSemesterSection;
            const content = `(${groupLabels}) ${subject.subjectName} [${classType}]\n${sectionTeacherLine}`;
            formattedSubjects.push(content);
          } else {
            // Class PDF: Show merged groups with teachers and rooms (rooms only for practical classes)
            const teachersLine = subject.teacherShortNames.join(', ');
            const roomsLine = subject.roomNames.join(', ');
            const content = roomsLine ? `(${groupLabels}) ${subject.subjectName} [${classType}]\n${teachersLine} | ${roomsLine}` : `(${groupLabels}) ${subject.subjectName} [${classType}]\n${teachersLine}`;
            formattedSubjects.push(content);
          }
        } else {
          // Single group for this subject
          const labGroupInfo = subject.labGroups.length > 0 ? `(Group ${subject.labGroups[0]})` : '';
          
          if (pdfType === 'teacher') {
            // Teacher PDF: Show subject and room only (no teacher names)
            const room = subject.roomNames[0] || '';
            const content = room ? `${labGroupInfo} ${subject.subjectName} [${classType}]\n${room}` : `${labGroupInfo} ${subject.subjectName} [${classType}]`;
            formattedSubjects.push(content);
          } else if (pdfType === 'room') {
            // Room PDF: Show subject and teacher with section info (no room names)
            const teacher = subject.teacherShortNames[0] || '';
            const sectionTeacherLine = teacher ? `${subject.programSemesterSection} | ${teacher}` : subject.programSemesterSection;
            const content = `${labGroupInfo} ${subject.subjectName} [${classType}]\n${sectionTeacherLine}`;
            formattedSubjects.push(content);
          } else {
            // Class PDF: Show teacher and room side by side for practical classes
            const teacher = subject.teacherShortNames[0] || '';
            const room = subject.roomNames[0] || '';
            const content = room ? `${labGroupInfo} ${subject.subjectName} [${classType}]\n${teacher} | ${room}` : `${labGroupInfo} ${subject.subjectName} [${classType}]\n${teacher}`;
            formattedSubjects.push(content);
          }
        }
      });

      return formattedSubjects.join('\n──────\n');
    }

    // Standard multi-group formatting (original logic)
    const { groups } = processedSlots;
    const groupContents = [];

    groups.forEach((group, index) => {
      let content = '';
      
      // Enhanced text wrapping for long subject names (from OLD service)
      let wrappedSubjectName = group.subjectName;
      const maxLineLength = 24;
      
      if (group.subjectName.length > maxLineLength) {
        const words = group.subjectName.split(' ');
        if (words.length >= 2) {
          const midPoint = Math.ceil(words.length / 2);
          const firstLine = words.slice(0, midPoint).join(' ');
          const secondLine = words.slice(midPoint).join(' ');
          wrappedSubjectName = `${firstLine}\n${secondLine}`;
        } else if (group.subjectName.includes('&')) {
          wrappedSubjectName = group.subjectName.replace(' & ', '\n& ');
        } else if (group.subjectName.includes('-')) {
          wrappedSubjectName = group.subjectName.replace(' - ', '\n- ');
        }
      }
      
      // Enhanced lab group indicator
      const labGroupIndicator = group.labGroup && group.labGroup !== 'ALL' ? ` (${group.labGroup})` : '';
      
      // Format: "Subject [Type]" with enhanced formatting
      content += `${wrappedSubjectName}${labGroupIndicator}`;
      if (group.classType && group.classType !== 'Regular') {
        content += ` [${this._getClassTypeText(group.classType)}]`;
      }
      content += '\n';
      
      // Add teacher and room info based on PDF type
      if (pdfType !== 'teacher') {
        const teachers = Array.isArray(group.teacherShortNames) 
          ? group.teacherShortNames.join(', ')
          : (group.teacherShortNames || 'TBA');
        content += `${teachers}`;
      }
      
      if (pdfType !== 'room' && group.classType === 'P') {
        // Only show room for practical classes
        const room = group.roomName || 'TBA';
        if (pdfType !== 'teacher') {
          content += ` | ${room}`;
        } else {
          content += room;
        }
      }
      
      // Program-Semester-Section (if room view)
      if (pdfType === 'room') {
        content += `${group.programSemesterSection}\n`;
        const teachers = Array.isArray(group.teacherShortNames) 
          ? group.teacherShortNames.join(', ')
          : (group.teacherShortNames || 'TBA');
        content += `${teachers}`;
      }

      groupContents.push(content.trim());
    });

    // Join with horizontal separator (matching frontend and OLD service visual)
    return groupContents.join('\n──────\n');
  }

  /**
   * Format single slot content
   */
  _formatSingleSlotContent(slot, pdfType, roomName = null, teacherName = null) {
    let content = '';
    
    const subjectName = slot.subjectId?.name || slot.subjectName_display || 'Unknown Subject';
    const subjectCode = slot.subjectId?.code || slot.subjectCode_display || '';
    const displaySubject = subjectCode ? `${subjectCode} - ${subjectName}` : subjectName;
    
    content += `${displaySubject}\n`;
    content += `[${this._getClassTypeText(slot.classType)}]\n`;
    
    if (pdfType !== 'teacher') {
      const teachers = slot.teacherIds?.map(t => 
        t.shortName || t.fullName?.split(' ').map(n => n[0]).join('.')
      ).join(', ') || slot.teacherNames_display || 'TBA';
      content += `${teachers}\n`;
    }
    
    if (pdfType !== 'room') {
      const room = slot.roomId?.name || slot.roomName_display || 'TBA';
      content += `${room}`;
    }
    
    if (pdfType === 'room') {
      const section = `${slot.programCode}-${slot.semester}-${slot.section}`;
      content += `${section}\n`;
      const teachers = slot.teacherIds?.map(t => 
        t.shortName || t.fullName?.split(' ').map(n => n[0]).join('.')
      ).join(', ') || 'TBA';
      content += `${teachers}`;
    }
    
    return content.trim();
  }

  /**
   * Get lab group label matching frontend logic
   */
  _getLabGroupLabel(group) {
    return `(Group ${group.labGroup})`;
  }

  /**
   * Get class type text matching frontend and OLD service formatting
   */
  _getClassTypeText(classType) {
    switch (classType) {
      case 'L': return 'L';     // Short format for PDF compactness
      case 'P': return 'P';     // Short format for PDF compactness  
      case 'T': return 'T';     // Short format for PDF compactness
      case 'BREAK': return 'Break';
      default: return classType || 'N/A';
    }
  }
}

module.exports = UnifiedPDFService;
