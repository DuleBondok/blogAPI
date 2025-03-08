const { authenticateJWT, isAdmin } = require("./middlewares");
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
require("dotenv").config();
const authMiddleware = require("./authMiddleware");
const cors = require("cors");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(cors());
app.get("/posts", async (req, res) => {
    res.set("Cache-Control", "no-store"); // Prevent caching for this route
    console.log("GET request to /posts received");
  
    try {
      const posts = await prisma.post.findMany({
        include: { author: true },
      });
      console.log("Fetched posts:", posts); // This should show in the backend logs
  
      if (posts.length === 0) {
        return res.json([]); // If no posts, send empty array
      }
  
      res.json(posts); // Send posts to frontend
    } catch (err) {
      console.error("Error fetching posts:", err);
      res.status(500).json({ message: "Error fetching posts" });
    }
  });

app.use(express.static(path.join(__dirname, "../frontend/build")));

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

app.post(
  "/create-post",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const authorId = req.user.id;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          author: { connect: { id: authorId } },
          image: imageUrl,
        },
      });

      res.status(201).json(newPost);
    } catch (err) {
      console.error("Error creating post:", err);
      res
        .status(500)
        .json({ message: "Error creating post", error: err.message });
    }
  }
);


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
