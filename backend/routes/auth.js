const express = require('express');
const User = require('../models/User');
const router = express.Router();
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'Sayantanisagoodb$oy';


// Create a User using POST "/api/auth/createuser". No login required
router.post('/createuser', [
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid Email').isEmail(),
], async (req, res) => {
  let success = false;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    success = false;
    return res.status(400).json({ success, error: error.array() });
  }
  try {

    let user = await User.findOne({ success, email: req.body.email })
    if (user) {
      success = false;
      return res.status(400).json({ success, error: "User Already Exist" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
    })
    const data = {
      user: {
        id: user.id
      }
    }
    success = true;
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ success, authToken });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Ocurred");

  }
})



// Authenticate a User using POST "/api/auth/login". No login required
router.post('/login', [
  body('password', 'Password cannot be blank').exists({ min: 5 }),
  body('email', 'Enter a valid Email').isEmail(),
], async (req, res) => {
  let success = false;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false;
      return res.status(400).json({ success, error: "Please try to login with correct credentials" })
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({ success, error: "Please try to login with correct credentials" })
    }
    const data = {
      user: {
        id: user.id
      }
    }
    success = true;
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ success, authToken });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");

  }

})

// Get loggedin User details using POST "/api/auth/getuser".login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {

    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");

  }
})



module.exports = router;