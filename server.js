const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const Fit = require("./models/workoutSchema.js");
const User = require("./models/userSchema.js");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");
const MongoStore = require("connect-mongo");
const app = express();
const session = require("express-session");
// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3002";
const authController = require("./controllers/auth.js");
app.use(express.urlencoded({ extended: false })); // This creates the req.body.
app.use(morgan('dev'));
app.use(methodOverride("_method"));
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      }),
    })
  );
app.use(express.static(path.join(__dirname, "public")));
app.use("/auth", authController);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.listen(3002, () => {
    console.log("Listening on port 3002");
});





// Home Page
app.get("/", (req, res) => {
    res.render("home.ejs", {
        user: req.session.user,
    });
});

// Protecting Routes
app.get("/workout/new", (req, res) => {
    if (req.session.user) {
      res.render(`newEntry.ejs`);
    } else {
      res.send("Sorry, no guests allowed.");
    }
  });

// // GET New Workout
// app.get("/workout/new", (req, res) => {
//     res.render("newEntry.ejs");
// });

// POST
app.post("/workout", async (req, res) => {
    await Fit.create(req.body);
    res.redirect("/workout");
});

// READ - Workout List
app.get("/workout", async (req, res) => {
    const allWorkouts = await Fit.find();
    res.render("allWorkouts.ejs", { workouts: allWorkouts });
});


// Show Route to Show Selected
app.get("/workout/:workoutId", async (req, res) => {
    const findWorkout = await Fit.findById(req.params.workoutId)
    res.render("showWorkout.ejs", { workout: findWorkout });
});

// Delete
app.delete("/workout/:workoutId", async (req, res) => {
    await Fit.findByIdAndDelete(req.params.workoutId);
    res.redirect("/workout")
});

// Edit
app.get("/workout/:workoutId/edit", async (req, res) => {
    const editWorkout = await Fit.findById(req.params.workoutId);
    res.render("edit.ejs", {workout: editWorkout});
});

// Update
app.put("/workout/:workoutId", async (req, res) => {
    await Fit.findByIdAndUpdate(req.params.workoutId, req.body);
    res.redirect("/workout");
});

// Protecting Routes
app.get("/workout/new", (req, res) => {
    if (req.session.user) {
      res.render(`newEntry.ejs`);
    } else {
      res.send("Sorry, no guests allowed.");
    }
  });