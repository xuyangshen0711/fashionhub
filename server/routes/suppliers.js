const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');

const router = express.Router();

// TODO: Gaoyuan will implement supplier routes here

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const suppliers = await db.collection('suppliers').find({}).toArray();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Placeholder routes for Gaoyuan to implement
router.get('/:id', async (req, res) => {
  res.json({ message: 'TODO: Get single supplier' });
});

router.post('/', async (req, res) => {
  res.json({ message: 'TODO: Create supplier' });
});

router.put('/:id', async (req, res) => {
  res.json({ message: 'TODO: Update supplier' });
});

router.delete('/:id', async (req, res) => {
  res.json({ message: 'TODO: Delete supplier' });
});

module.exports = router;