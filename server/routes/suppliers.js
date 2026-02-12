const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');

const router = express.Router();

// Get all suppliers (supports filter + search)
// GET /api/suppliers?category=fabrics&search=abc
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { category, search } = req.query;

    const filter = {};

    // category filter (stored as categories: [])
    if (category) {
      filter.categories = { $in: [category] };
    }

    // search in companyName / contactPerson / email / phone / address / categories
    if (search && String(search).trim()) {
      const q = String(search).trim();
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { companyName: regex },
        { contactPerson: regex },
        { email: regex },
        { phone: regex },
        { address: regex },
        { categories: regex }, // works if categories is an array of strings too
        { notes: regex }
      ];
    }

    const suppliers = await db.collection('suppliers').find(filter).sort({ createdAt: -1 }).toArray();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single supplier
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid supplier id' });

    const supplier = await db.collection('suppliers').findOne({ _id: new ObjectId(id) });
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create supplier
router.post('/', async (req, res) => {
  try {
    const db = getDB();

    const {
      companyName,
      contactPerson,
      phone,
      email,
      address,
      categories,
      rating,
      notes
    } = req.body;

    if (!companyName || !String(companyName).trim()) {
      return res.status(400).json({ error: 'companyName is required' });
    }

    const doc = {
      companyName: String(companyName).trim(),
      contactPerson: contactPerson ? String(contactPerson).trim() : '',
      phone: phone ? String(phone).trim() : '',
      email: email ? String(email).trim() : '',
      address: address ? String(address).trim() : '',
      categories: Array.isArray(categories)
          ? categories.map(c => String(c).trim()).filter(Boolean)
          : (typeof categories === 'string'
              ? categories.split(',').map(c => c.trim()).filter(Boolean)
              : []),
      rating: rating !== undefined && rating !== null && rating !== '' ? Number(rating) : 3,
      notes: notes ? String(notes).trim() : '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // clamp rating 1-5
    if (Number.isNaN(doc.rating)) doc.rating = 3;
    doc.rating = Math.max(1, Math.min(5, doc.rating));

    const result = await db.collection('suppliers').insertOne(doc);
    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update supplier
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid supplier id' });

    const {
      companyName,
      contactPerson,
      phone,
      email,
      address,
      categories,
      rating,
      notes
    } = req.body;

    const update = {
      updatedAt: new Date()
    };

    if (companyName !== undefined) update.companyName = String(companyName).trim();
    if (contactPerson !== undefined) update.contactPerson = String(contactPerson).trim();
    if (phone !== undefined) update.phone = String(phone).trim();
    if (email !== undefined) update.email = String(email).trim();
    if (address !== undefined) update.address = String(address).trim();
    if (notes !== undefined) update.notes = String(notes).trim();

    if (categories !== undefined) {
      update.categories = Array.isArray(categories)
          ? categories.map(c => String(c).trim()).filter(Boolean)
          : (typeof categories === 'string'
              ? categories.split(',').map(c => c.trim()).filter(Boolean)
              : []);
    }

    if (rating !== undefined) {
      let r = Number(rating);
      if (Number.isNaN(r)) r = 3;
      update.rating = Math.max(1, Math.min(5, r));
    }

    const result = await db.collection('suppliers').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: 'after' }
    );

    if (!result.value) return res.status(404).json({ error: 'Supplier not found' });

    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete supplier
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid supplier id' });

    const result = await db.collection('suppliers').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Supplier not found' });

    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
