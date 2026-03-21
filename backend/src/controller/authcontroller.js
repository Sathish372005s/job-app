import jwt from "jsonwebtoken";
import User from "../models/user.js";

// 🔑 Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


// ✅ Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, skills, experience } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      skills,
      experience,
    });

    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({ user: userData, token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({ user: userData, token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Logout (Stateless)
export const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};