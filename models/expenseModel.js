const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  category: {
    type: String,
    enum: ["Food", "Transport", "Entertainment", "Other"],
    required: [true, "Category is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
