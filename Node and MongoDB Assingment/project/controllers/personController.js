const Person = require('../models/personModel');
const { validationResult } = require('express-validator');

// Get all people
exports.getAllPeople = async (req, res) => {
  try {
    const people = await Person.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: people.length,
      data: {
        people
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single person by ID
exports.getPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    
    if (!person) {
      return res.status(404).json({
        status: 'fail',
        message: 'Person not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        person
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new person
exports.createPerson = async (req, res) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array()
      });
    }
    
    const newPerson = await Person.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        person: newPerson
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update a person
exports.updatePerson = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array()
      });
    }
    
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!person) {
      return res.status(404).json({
        status: 'fail',
        message: 'Person not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        person
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete a person
exports.deletePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    
    if (!person) {
      return res.status(404).json({
        status: 'fail',
        message: 'Person not found'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};