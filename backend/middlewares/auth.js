const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "NO toke, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; //add the user id to request object
    next(); //proceede to next middle ware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
