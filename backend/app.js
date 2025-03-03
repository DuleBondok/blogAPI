const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("/api/example", (req, res) => {
    res.json({ message: "This is an API response" });
});

app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});


app.listen(5000, () => {
    console.log("Server running on port 5000");
});