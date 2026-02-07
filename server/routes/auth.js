const express = require('express');
const crypto = require('crypto');
const { getDB } = require('../db');

const router = express.Router();

// Simple password hashing (for demo purposes)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Register new user
router.post('/register', async (req, res) => {
  try {
    const db = getDB();
    const { username, password, email, role } = req.body;
    
    // Check if username already exists
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Create new user
    const user = {
      username,
      password: hashPassword(password),
      email: email || '',
      role: role || 'user',
      createdAt: new Date()
    };
    
    await db.collection('users').insertOne(user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const db = getDB();
    const { username, password } = req.body;
    
    const user = await db.collection('users').findOne({ 
      username,
      password: hashPassword(password)
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Return user info (without password)
    res.json({
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection('users')
      .find({}, { projection: { password: 0 } })
      .toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;