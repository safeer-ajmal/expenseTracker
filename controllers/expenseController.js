const Expense = require("../models/expenseModel");
//@ts-ignore
const CustomError = require("../errors/CustomError");

// @desc Get all expenses
exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find();
  res.status(200).json({ success: true, data: expenses });
};

// @desc Create a new expense
exports.createExpense = async (req, res) => {
  const { title, amount, category } = req.body;
  if (!title || !amount || !category) {
    throw new CustomError("Please provide all required fields", 400);
  }

  const newExpense = await Expense.create(req.body);
  res.status(201).json({ success: true, data: newExpense });
};

// @desc Update an expense
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedExpense) {
    throw new CustomError("Expense not found", 404);
  }

  res.status(200).json({ success: true, data: updatedExpense });
};

// @desc Delete an expense
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  const deletedExpense = await Expense.findByIdAndDelete(id);

  if (!deletedExpense) {
    throw new CustomError("Expense not found", 404);
  }

  res.status(200).json({ success: true, data: {} });
};
