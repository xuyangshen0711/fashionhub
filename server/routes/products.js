const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { category, minPrice, maxPrice, status } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    const products = await db.collection('products').find(filter).toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const product = await db.collection('products').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const product = {
      name: req.body.name,
      image: req.body.image || '',
      price: parseFloat(req.body.price),
      sizes: req.body.sizes || [],
      colors: req.body.colors || [],
      category: req.body.category,
      status: req.body.status || 'active',
      inventory: parseInt(req.body.inventory) || 0,
      createdAt: new Date()
    };
    const result = await db.collection('products').insertOne(product);
    res.status(201).json({ ...product, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const updates = { ...req.body };
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.inventory) updates.inventory = parseInt(updates.inventory);
    updates.updatedAt = new Date();
    
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('products').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;