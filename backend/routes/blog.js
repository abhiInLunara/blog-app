const express = require("express");
const auth = require("../middlewares/auth");
const Blog = require("../models/Blog");
const User = require("../models/User");

const route = express.Router();

// route to create a blog
router.post("/create", auth, async (req, res) => {
  const { title, content } = req.body;

  // try{
  //     const newBlog
  // }
});
