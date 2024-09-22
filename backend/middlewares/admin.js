module.exports = function (req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ messsage: "Access Denied, Admin only" });
  }
  next();
};
