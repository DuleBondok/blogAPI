const { authenticateJWT, isAdmin } = require("./middlewares");
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use(express.json());

app.get("/api/example", (req, res) => {
  res.json({ message: "This is an API response" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.post("/signup", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword, role: "user" },
    });

    res.json({
      message: "User created successfully",
      user: { username: newUser.username },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

app.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({ where: { username } });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
  
      
      const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1h" }
      );
  
      res.json({ message: "Login successful", token, role: user.role });
    } catch (err) {
      console.error("Login error: ", err);
      res.status(500).json({ message: "Error logging in", error: err.message });
    }
  });

  app.get("/admin", authenticateJWT, isAdmin, (req, res) => {
    res.json({ message: "Welcome, Admin!" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
