const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.get("/login", (req,res) => {
    res.render("login");
});


app.listen(5000);