const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const timeSlotController = require('../controllers/timeSlotController');

// Validation rules
const timeSlotValidation = [
  body('_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Slot index (_id) must be a positive integer'),
  body('label')
    .isLength({ min: 1, max: 50 })
    .withMessage('Label is required and must be max 50 characters'),
  body('startTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format (24-hour)'),
  body('endTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format (24-hour)'),
  body('sortOrder')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sort order must be a positive integer'),
  body('dayType')
    .optional()
    .isIn(['Regular', 'Saturday', 'Holiday'])
    .withMessage('Day type must be Regular, Saturday, or Holiday'),
  body('category')
    .optional()
    .isIn(['Morning', 'Afternoon', 'Evening'])
    .withMessage('Category must be Morning, Afternoon, or Evening'),
  body('isBreak')
    .optional()
    .isBoolean()
    .withMessage('isBreak must be a boolean'),
  body('applicableDays')
    .optional()
    .isArray()
    .withMessage('applicableDays must be an array'),
  body('applicableDays.*')
    .isInt({ min: 0, max: 6 })
    .withMessage('Each applicable day must be between 0-6')
];

// @route   GET /api/time-slots
// @desc    Get all time slots
// @access  Private
router.get('/', protect, timeSlotController.getTimeSlots);

// @route   GET /api/time-slots/category/:category
// @desc    Get time slots by category
// @access  Private
router.get('/category/:category', protect, timeSlotController.getTimeSlotsByCategory);

// @route   POST /api/time-slots/initialize
// @desc    Initialize default time slots
// @access  Private/Admin
router.post('/initialize', [protect, authorize('admin')], timeSlotController.initializeTimeSlots);

// @route   POST /api/time-slots/reorder
// @desc    Reorder all time slots chronologically
// @access  Private/Admin
router.post('/reorder', [protect, authorize('admin')], timeSlotController.reorderTimeSlots);

// @route   POST /api/time-slots/context/:programCode/:semester/:section
// @desc    Create a context-specific time slot
// @access  Private/Admin
router.post('/context/:programCode/:semester/:section', [protect, authorize('admin'), ...timeSlotValidation], timeSlotController.createContextTimeSlot);

// @route   POST /api/time-slots
// @desc    Create a new time slot
// @access  Private/Admin
router.post('/', [protect, authorize('admin'), ...timeSlotValidation], timeSlotController.createTimeSlot);

// @route   GET /api/time-slots/:id
// @desc    Get time slot by ID (slotIndex)
// @access  Private
router.get('/:id', protect, timeSlotController.getTimeSlotById);

// @route   PUT /api/time-slots/:id
// @desc    Update time slot
// @access  Private/Admin
router.put('/:id', [protect, authorize('admin'), ...timeSlotValidation], timeSlotController.updateTimeSlot);

// @route   DELETE /api/time-slots/bulk
// @desc    Bulk delete time slots
// @access  Private/Admin
router.delete('/bulk', [protect, authorize('admin')], timeSlotController.bulkDeleteTimeSlots);

// @route   DELETE /api/time-slots/:id
// @desc    Delete time slot
// @access  Private/Admin
router.delete('/:id', [protect, authorize('admin')], timeSlotController.deleteTimeSlot);

module.exports = router;
