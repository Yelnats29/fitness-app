const express = require("express");
const router = express.Router();
const User = require("../models/userSchema.js");
const bcrypt = require("bcrypt");

// GET the route
router.get("/sign-up", (req, res) => {
    res.render("auth/signup.ejs");
});

// POST the route to Sign Up (can i redirect this and you prompts for alerts?)
router.post("/sign-up", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
        return res.send("Username already taken.");
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match");
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);
    req.session.user = {
        username: user.username,
    };

    req.session.save(() => {
        res.redirect("/");
    });;
});

// Login Route
router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
});

// POST the route to Login 
router.post("/login", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
        return res.send("Login failed. Please try again.");
    }
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    if (!validPassword) {
        return res.send("Login failed. Please try again.");
    }
    req.session.user = {
        username: userInDatabase.username,
    };
    req.session.save(() => {
        res.redirect("/");
    });
});

// Log Out Route
router.get("/log-out", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;