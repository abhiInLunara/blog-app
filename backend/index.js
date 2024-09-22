const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog.js");
const auth = require("./middlewares/auth.js");

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// Middle ware to pass incoming json request
app.use(express.json());
app.use((req, res, next) => {
  console.log(req);
  next();
});

// connnecting with database
mongoose
  .connect(process.env.MONGO_URI) //{ useNewUrlPareser: true,useUnifeidTopology: true  }
  .then(() => console.log("Conncted to the DB"))
  .catch((err) => console.log("Error while connecting to the DB", err));

// using auth route
app.use("/api/auth", authRoutes);

// using blog route
app.use("/api/blogs", blogRoutes);

// protected route example
app.get("/api/protected", auth, (req, res) => {
  res.json({ message: "you are accesing protected route", userId: req.user });
});
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server is running on port NO : ${PORT}`);
});
