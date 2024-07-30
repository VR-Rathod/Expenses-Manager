let participants = [];
let expenses = [];

// Add Person
function addPerson() {
    const personName = prompt("Enter person's name:");
    if (personName && !participants.some(p => p.name === personName)) {
        participants.push({ name: personName, expenses: [] });
        updatePeopleList();
        handleExpenseMethodChange(); // Update the split inputs when a new person is added
    }
}

// Update People List
function updatePeopleList() {
    const peopleList = document.getElementById('peopleList');
    peopleList.innerHTML = participants.map(p => `<p>${p.name}</p>`).join('');
    handleExpenseMethodChange(); // Update the split inputs when the list changes
}

// Add Expense
function addExpense(event) {
    event.preventDefault(); // Prevent default form submission

    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const method = document.getElementById('expenseMethod').value;

    if (description && !isNaN(amount) && amount > 0) {
        const expense = {
            description,
            amount,
            method,
            splits: []
        };

        if (method === 'exact') {
            const inputs = Array.from(document.querySelectorAll('#splitInputs input'));
            let totalSplit = 0;
            const splits = inputs.map(input => {
                const person = input.dataset.person;
                const splitAmount = parseFloat(input.value) || 0;
                totalSplit += splitAmount;
                return { person, amount: splitAmount };
            });

            if (totalSplit !== amount) {
                alert('Total split amount must match the expense amount.');
                return;
            }

            expense.splits = splits;
        } else if (method === 'percentage') {
            const inputs = Array.from(document.querySelectorAll('#splitInputs input'));
            let totalPercentage = 0;
            const splits = inputs.map(input => {
                const person = input.dataset.person;
                const percentage = parseFloat(input.value) || 0;
                totalPercentage += percentage;
                return { person, percentage };
            });

            if (totalPercentage !== 100) {
                alert('Total percentages must add up to 100%.');
                return;
            }

            expense.splits = splits.map(split => ({
                person: split.person,
                amount: (amount * split.percentage / 100).toFixed(2)
            }));
        } else if (method === 'equal') {
            const splitAmount = (amount / participants.length).toFixed(2);
            expense.splits = participants.map(p => ({
                person: p.name,
                amount: splitAmount
            }));
        }

        expenses.push(expense);
        updateBalanceSheet();
        clearExpenseForm(); // Clear the form fields after adding the expense
    } else {
        alert('Please enter a valid description and amount.');
    }
}

// Handle Expense Method Change
function handleExpenseMethodChange() {
    const method = document.getElementById('expenseMethod').value;
    const splitInputs = document.getElementById('splitInputs');
    splitInputs.innerHTML = ''; // Clear previous inputs

    if (participants.length === 0) {
        return;
    }

    participants.forEach(person => {
        const div = document.createElement('div');
        div.innerHTML = `<label>${person.name}:</label>
                          <input type="number" data-person="${person.name}" placeholder="${method === 'percentage' ? 'Percentage' : 'Amount'}" step="0.01">`;
        splitInputs.appendChild(div);
    });

    // Add input event listeners for dynamic updates
    document.querySelectorAll('#splitInputs input').forEach(input => {
        input.addEventListener('input', updateRemainingAmount);
    });

    updateRemainingAmount();
}

// Update Remaining Amount
function updateRemainingAmount() {
    const method = document.getElementById('expenseMethod').value;
    const inputs = Array.from(document.querySelectorAll('#splitInputs input'));
    const amount = parseFloat(document.getElementById('expenseAmount').value) || 0;
    let totalAmount = 0;
    let totalPercentage = 0;

    inputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        if (method === 'exact') {
            totalAmount += value;
            input.placeholder = `Remaining: ${(amount - totalAmount).toFixed(2)}`;
        } else if (method === 'percentage') {
            totalPercentage += value;
            input.placeholder = `Remaining: ${(100 - totalPercentage).toFixed(2)}%`;
        }
    });

    if (method === 'equal') {
        // Calculate and auto-fill equal split amounts
        const splitAmount = (amount / participants.length).toFixed(2);
        inputs.forEach(input => {
            input.value = splitAmount;
            input.placeholder = '';
        });
    }

    document.getElementById('addExpenseBtn').disabled = 
        (method === 'exact' && amount !== totalAmount) || 
        (method === 'percentage' && totalPercentage !== 100) ||
        (method === 'equal' && participants.length === 0); // Disable button if no participants
}

// Clear Expense Form
function clearExpenseForm() {
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseMethod').value = 'exact';
    document.getElementById('splitInputs').innerHTML = '';
    document.getElementById('formMessage').innerHTML = ''; // Clear any messages
}

// Update Balance Sheet
function updateBalanceSheet() {
    const individualExpenseList = document.getElementById('individualExpenseList');
    const totalExpenseAmount = document.getElementById('totalExpenseAmount');
    const splitMethodDetails = document.getElementById('splitMethodDetails');

    let totalAmount = 0;
    let splitDetails = '';

    individualExpenseList.innerHTML = '';
    splitMethodDetails.innerHTML = '';

    expenses.forEach(exp => {
        totalAmount += exp.amount;
        individualExpenseList.innerHTML += `<li>${exp.description}: ${exp.amount}</li>`;
        splitDetails += `<div><strong>${exp.description}:</strong>`;
        exp.splits.forEach(split => {
            splitDetails += `<p>${split.person}: ${split.amount}</p>`;
        });
        splitDetails += `</div>`;
    });

    totalExpenseAmount.innerText = `Total Expenses: ${totalAmount.toFixed(2)}`;
    splitMethodDetails.innerHTML = splitDetails;
}

// Download Balance Sheet
function downloadBalanceSheet() {
    const balanceSheet = document.getElementById('balanceSheet').innerText;
    const blob = new Blob([balanceSheet], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'balance_sheet.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Initialize
document.getElementById('addPersonBtn').addEventListener('click', addPerson);
document.getElementById('addExpenseBtn').addEventListener('click', addExpense);
document.getElementById('expenseMethod').addEventListener('change', handleExpenseMethodChange);
document.getElementById('downloadBalanceSheetBtn').addEventListener('click', downloadBalanceSheet);

// Initial setup
handleExpenseMethodChange();