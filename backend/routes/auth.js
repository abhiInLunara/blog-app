const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// User signup route
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // cheking if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already Exists" });
    }

    // hash the user password
    const hashPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
    });

    // save the user
    await newUser.save();
    res.status(201).json({ message: "User register succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Error Registering user" });
  }
});

// user login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email does't exists" });
    }
    // comparing provided password with stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or password" });
    }

    // genratie jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "error loggin in" });
  }
});

module.exports = router;
