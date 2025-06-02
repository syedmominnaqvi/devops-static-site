const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { Waitlist } = require('../models');

// Validation schema for waitlist registration
const waitlistSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  transactionVolume: Joi.string().required(),
  salary: Joi.string().required(),
  debt: Joi.string().required(),
  cardType: Joi.string().valid('classic', 'optimo', 'femme', 'gold', 'platinum').required()
});

// In-memory storage as fallback when database is not available
const waitlistEntries = [];
let dbConnected = false;

// Middleware to check if database is connected
const checkDbConnection = (req, res, next) => {
  req.dbConnected = dbConnected;
  next();
};

// Set database connection status
const setDbStatus = (status) => {
  dbConnected = status;
};

// POST - Add a user to the waitlist
router.post('/waitlist', checkDbConnection, async (req, res) => {
  try {
    // Validate request data
    const { error, value } = waitlistSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (req.dbConnected) {
      // Database is connected - save to PostgreSQL
      const entry = await Waitlist.create(value);
      return res.status(201).json({
        message: 'Successfully added to the waitlist!',
        id: entry.id
      });
    } else {
      // No database connection - save in memory
      const entry = {
        id: Date.now().toString(),
        ...value,
        createdAt: new Date().toISOString()
      };
      waitlistEntries.push(entry);
      return res.status(201).json({
        message: 'Successfully added to the waitlist! (stored in-memory)',
        id: entry.id
      });
    }
  } catch (err) {
    // Check for unique constraint violation (duplicate email)
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'This email is already registered on our waitlist.' });
    }
    console.error('Error adding to waitlist:', err);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// GET - Get all waitlist entries (admin only, would require auth in production)
router.get('/waitlist', checkDbConnection, async (req, res) => {
  try {
    if (req.dbConnected) {
      // Database is connected - get from PostgreSQL
      const entries = await Waitlist.findAll();
      return res.json(entries);
    } else {
      // No database connection - get from memory
      return res.json(waitlistEntries);
    }
  } catch (err) {
    console.error('Error fetching waitlist entries:', err);
    res.status(500).json({ error: 'An error occurred while fetching waitlist entries.' });
  }
});

module.exports = { 
  router,
  setDbStatus
};