# PDF Service Merge and Time Slot Fix Plan

## Issues to Fix

### 1. Duplicate PDF Services
- **backend/services/PDFRoutineService.js** (main service)
- **backend/utils/pdfGeneration.js** (utility classes)
- **backend/utils/roomPdfGeneration.js** (specialized for rooms)
- **backend/utils/teacherPdfGeneration.js** (specialized for teachers)

### 2. Duplicate Routes
- **backend/routes/pdf.js** (dedicated PDF routes)
- **backend/routes/routine.js** (PDF routes mixed with routine routes)

### 3. Multiple fillRoutineData Methods
- Each service has its own `fillRoutineData` implementation
- Slight variations causing inconsistencies

### 4. Time Slot Mapping Bug
- **Critical Issue**: `slotIndex` in RoutineSlot should map to `TimeSlot._id`
- **Current Bug**: PDF uses `slotIndex` as array index into sorted timeSlots array
- **Problem**: When new time slots added, array order changes but slotIndex references remain
- **Example**: Time slot "05:00-07:00" with `_id: 9` gets `sortOrder: 1`, shifts array but breaks mapping

## Solution Plan

### Phase 1: Merge PDF Services
1. Consolidate all PDF generation into `PDFRoutineService.js`
2. Create unified `fillRoutineData` method with time slot fix
3. Remove duplicate utility files
4. Update imports across codebase

### Phase 2: Fix Time Slot Mapping
1. Change mapping from `timeSlots[slotIndex - 1]` to `timeSlots.find(ts => ts._id === slotIndex)`
2. Update all PDF generation methods
3. Ensure frontend-backend consistency

### Phase 3: Merge Routes
1. Remove duplicate routes from `routes/pdf.js`
2. Keep all PDF routes in `routes/routine.js`
3. Update controller imports

### Phase 4: Testing
1. Test all PDF export types
2. Verify time slot mapping accuracy
3. Ensure no functionality regression

## Expected Benefits
- Single source of truth for PDF generation
- Fixed time slot mapping bug
- Cleaner codebase
- Consistent PDF output
- Better maintainability
