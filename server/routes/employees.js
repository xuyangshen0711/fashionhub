const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');

const router = express.Router();

// Get all employees
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { department, position } = req.query;
    
    let filter = {};
    if (department) filter.department = department;
    if (position) filter.position = position;
    
    const employees = await db.collection('employees').find(filter).toArray();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single employee
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const employee = await db.collection('employees').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create employee
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const employee = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      department: req.body.department,
      position: req.body.position,
      salary: parseFloat(req.body.salary) || 0,
      hireDate: req.body.hireDate || new Date().toISOString().split('T')[0],
      status: req.body.status || 'active',
      createdAt: new Date()
    };
    const result = await db.collection('employees').insertOne(employee);
    res.status(201).json({ ...employee, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const updates = { ...req.body };
    if (updates.salary) updates.salary = parseFloat(updates.salary);
    updates.updatedAt = new Date();
    
    const result = await db.collection('employees').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('employees').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;