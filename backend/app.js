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

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/posts", async (req, res) => {
    res.set("Cache-Control", "no-store");
    console.log("GET request to /posts received");
  
    try {
      const posts = await prisma.post.findMany({
        include: { author: true },
      });
      console.log("Fetched posts:", posts);
  
      if (posts.length === 0) {
        return res.json([]); 
      }
  
      res.json(posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      res.status(500).json({ message: "Error fetching posts" });
    }
  });

  app.get("/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const post = await prisma.post.findUnique({
        where: { id: id },
        include: { author: true },
      });

      if (!post) return res.status(404).json({ message: "Post not found" });

      res.json(post);
    } catch (err) {
      console.error("Error fetching post:", err);
      res.status(500).json({ message: "Error fetching post" });
    }
});

app.get("/posts/:id/comments", async (req, res) => {
    const { id } = req.params;
    try {
      const comments = await prisma.comment.findMany({
        where: { postId: id },
        include: { author: true },
      });
      res.json(comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      res.status(500).json({ message: "Error fetching comments" });
    }
  });


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

app.post("/create-comment", authenticateJWT, async (req, res) => {
    const { content, postId } = req.body;
    const authorId = req.user.id;

    if (!content || !postId) {
        return res.status(400).json({ message: "Content and postId are required" });
    }

    try {

        console.log("Creating comment with:", { content, postId, authorId });
        
        console.log("Received comment data:", { content, postId, authorId });

        
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        
        const newComment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: authorId,
            },
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Error creating comment", error: error.message });
    }
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

app.get("/admin", authenticateJWT, isAdmin, (req, res) => {
    res.json({ message: "Welcome, Admin!" });
  });

app.use(express.static(path.join(__dirname, "../frontend/build")));


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
