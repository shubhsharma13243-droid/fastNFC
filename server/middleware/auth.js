const jwt = require("jsonwebtoken");

// Protects private routes: reads the token, puts the user id on req.userId
module.exports = (req, res, next) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ message: "Please log in again" });
  }
};
