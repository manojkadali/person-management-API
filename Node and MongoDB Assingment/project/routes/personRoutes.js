const express = require('express');
const { body } = require('express-validator');
const personController = require('../controllers/personController');

const router = express.Router();


const personValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a positive number'),
  body('gender').trim().notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
  body('mobile').trim().notEmpty().withMessage('Mobile number is required')
    .matches(/^\d{10,15}$/).withMessage('Please enter a valid mobile number')
];

// GET all people
router.get('/', personController.getAllPeople);

// GET a single person
router.get('/:id', personController.getPerson);

// POST a new person
router.post('/', personValidationRules, personController.createPerson);

// UPDATE a person
router.put('/:id', personValidationRules, personController.updatePerson);

// DELETE a person
router.delete('/:id', personController.deletePerson);

module.exports = router;