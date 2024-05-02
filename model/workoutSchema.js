const mongoose = require("mongoose");

const fitSchema = new mongoose.Schema({
    
    date: Date,
    workoutName: String,
    programName: String,
    weight: Number,
    duration: String,
    markCompleted: Boolean,
    trackNow: Boolean,
    mainGoal: String,
    startDate: Date,
    workoutFocus: String,
    sets: Number,
    reps: Number,
    equipment: String,
    description: String,
  });

const Fit = mongoose.model("Fit", fitSchema);

module.exports = Fit;