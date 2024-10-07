const form = document.getElementById("expense-form");
const expensesTableBody = document.querySelector("#expenses-table tbody");

let isEditing = false;
let editingExpenseId = null; // Track the ID of the expense being edited

// Fetch and display existing expenses
async function loadExpenses() {
  const response = await fetch("/api/expenses");
  const { data } = await response.json();
  displayExpenses(data);
}

function displayExpenses(expenses) {
  expensesTableBody.innerHTML = "";
  expenses.forEach((expense) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Title">${expense.title}</td>
      <td data-label="Amount">${expense.amount}</td>
      <td data-label="Category">${expense.category}</td>
      <td data-label="Date">${new Date(expense.date).toLocaleDateString()}</td>
      <td>
        <button class="edit" data-id="${expense._id}">Edit</button>
        <button class="delete" data-id="${expense._id}">Delete</button>
      </td>
    `;
    expensesTableBody.appendChild(row);
  });
}

// Add new expense
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  const method = isEditing ? "PUT" : "POST";
  const endpoint = isEditing
    ? `/api/expenses/${editingExpenseId}`
    : "/api/expenses";

  const response = await fetch(endpoint, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, amount, category }),
  });

  if (response.ok) {
    form.reset();
    isEditing = false;
    editingExpenseId = null;
    loadExpenses();
  }
});

// Handle click events for editing and deleting expenses
expensesTableBody.addEventListener("click", async (e) => {
  const target = e.target;
  const id = target.dataset.id;

  // Handle delete
  if (target.classList.contains("delete")) {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    loadExpenses();
  }

  // Handle edit
  else if (target.classList.contains("edit")) {
    // Prevent switching to save before the user can interact
    if (isEditing) return;

    const row = target.closest("tr");
    const titleCell = row.querySelector("td[data-label='Title']");
    const amountCell = row.querySelector("td[data-label='Amount']");
    const categoryCell = row.querySelector("td[data-label='Category']");

    // Replace cells with input fields for editing
    titleCell.innerHTML = `<input type="text" value="${titleCell.textContent.trim()}" class="edit-title" />`;
    amountCell.innerHTML = `<input type="number" value="${amountCell.textContent.trim()}" class="edit-amount" />`;
    categoryCell.innerHTML = `
      <select class="edit-category">
        <option value="Food" ${
          categoryCell.textContent === "Food" ? "selected" : ""
        }>Food</option>
        <option value="Transport" ${
          categoryCell.textContent === "Transport" ? "selected" : ""
        }>Transport</option>
        <option value="Entertainment" ${
          categoryCell.textContent === "Entertainment" ? "selected" : ""
        }>Entertainment</option>
        <option value="Other" ${
          categoryCell.textContent === "Other" ? "selected" : ""
        }>Other</option>
      </select>
    `;

    // Change edit button to save button
    target.textContent = "Save";
    target.classList.remove("edit");
    target.classList.add("save");

    isEditing = true; // Set editing state to true
    editingExpenseId = id;

    // Prevent the click event from bubbling up to the table body
    e.stopPropagation();
  }

  // Handle save after editing
  else if (target.classList.contains("save")) {
    const row = target.closest("tr");
    const updatedTitle = row.querySelector(".edit-title").value;
    const updatedAmount = row.querySelector(".edit-amount").value;
    const updatedCategory = row.querySelector(".edit-category").value;

    await fetch(`/api/expenses/${editingExpenseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: updatedTitle,
        amount: updatedAmount,
        category: updatedCategory,
      }),
    });

    loadExpenses();
    isEditing = false; // Reset editing state
    editingExpenseId = null; // Clear the expense ID
  }
});

// Load expenses when the page loads
window.addEventListener("DOMContentLoaded", loadExpenses);
