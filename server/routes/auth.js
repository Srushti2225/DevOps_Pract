const express = require('express'); 
const router = express.Router(); 
const bcrypt = require('bcryptjs'); 
const User = require('../models/User'); 
const isStrongPassword = pw => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pw); 
// Check username 
router.get('/check-username', async (req, res) => { 
const { username } = req.query; 
const exists = await User.findOne({ username }); 
res.json({ ok: !exists }); 
}); 
// Check email 
router.get('/check-email', async (req, res) => { 
const { email } = req.query; 
const exists = await User.findOne({ email: email.toLowerCase() }); 
res.json({ ok: !exists }); 
}); 
// Register 
router.post('/register', async (req, res) => { 
try { 
const { username, email, password, mobile } = req.body; 
if (!username || !email || !password || !mobile) return res.status(400).json({ msg:'All fields required' }); 
if (!/^\d+$/.test(mobile)) return res.status(400).json({ msg:'Mobile must contain only digits' 
}); 
if (!isStrongPassword(password)) return res.status(400).json({ msg:'Password too weak' }); 
if (await User.findOne({ username })) return res.status(400).json({ msg:'Username taken' 
}); 
if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ 
msg:'Email registered' }); 
const hashed = await bcrypt.hash(password, 12); 
const user = new User({ username, email: email.toLowerCase(), password: hashed, mobile 
}); 
await user.save(); 
res.json({ msg:'Registration successful' }); 
} catch (err) { 
if (err.code === 11000) return res.status(400).json({ msg:'Duplicate field exists' }); 
    console.error(err); 
    res.status(500).json({ msg:'Server error' }); 
  } 
}); 
 
module.exports = router; 