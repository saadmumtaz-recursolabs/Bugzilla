const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded", decoded);

      req.user = await User.findById(decoded.userId).select("-password");
      console.log("req object", req.user);

      if (!req.user) {
        return res
          .status(401)
          .json({ error: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
};
const managerOnly = (req, res, next) => {
  if (req.user && req.user.role === "Manager") {
    next();
  } else {
    res.status(403).json({ error: "Access denied: Manager only" });
  }
};

const managerOrQAOnly = (req, res, next) => {
  if (req.user && (req.user.role === "Manager" || req.user.role === "QA")) {
    next();
  } else {
    res.status(403).json({ error: "Access denied: Manager or QA only" });
  }
};

module.exports = { protect, managerOnly, managerOrQAOnly };
