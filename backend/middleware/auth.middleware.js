import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protectedroute = async (req, res, next) => {
  try {
    console.log("Auth middleware hit");
    let token;
    console.log("check2")
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ message: "Not authorized to access this route" });
    }
    console.log("3")
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("4")
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (error) {
    console.error("Error from auth middleware:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};