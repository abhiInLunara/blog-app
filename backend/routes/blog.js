const express = require("express");
const auth = require("../middlewares/auth");
const Blog = require("../models/Blog");
const User = require("../models/User");
const router = require("./auth");
const admin = require("../middlewares/admin");

const route = express.Router();

// route to create a blog
router.post("/create", auth, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newBlog = new Blog({
      title,
      content,
      author: req.user,
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created and send for approval", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Errir creating Blog" });
  }
});

// Route to get all blogs (approved blogs)
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.gind({ status: "approved" }).populate(
      "author",
      "name"
    );
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fecthing blog", error });
  }
});

// route to get blogs for the logged-in user (rejected and pending as well)
router.get("/my-blogs", auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user }).populate(
      "author",
      "name"
    );
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "error fetching user blog", error });
  }
});

router.put("/admin/approve/:id", admin, async (req, res) => {
  const { status, comments } = req.body;
  try {
    // finding blog by its id
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "blog not found" });
    }

    // update blog status
    blog.status = status;
    blog.comments = comments || "";

    await blog.save();

    res.json({ message: `blog ${status}`, blog });
  } catch (error) {
    res.status(500).json({ message: "error updating blog status", error });
  }
});

module.exports = router;
