// --- NEW COMPONENT 4: ExpenseForm ---
// INSTRUCTOR NOTE: This is the heavy lifter for Phase 2.
// It manages the "local state" of the user's inputs.

import { useState } from 'react';

const ExpenseForm = (props) => {
    // 1. Multiple States for multiple inputs
    const [enteredTitle, setEnteredTitle] = useState('');
    const [enteredAmount, setEnteredAmount] = useState('');
    const [enteredDate, setEnteredDate] = useState('');

    // 2. Event Handlers
    const titleChangeHandler = (event) => {
        setEnteredTitle(event.target.value);
    };

    const amountChangeHandler = (event) => {
        setEnteredAmount(event.target.value);
    };

    const dateChangeHandler = (event) => {
        setEnteredDate(event.target.value);
    };

    const submitHandler = (event) => {
        event.preventDefault(); // Prevent page reload!

        const expenseData = {
            title: enteredTitle,
            amount: +enteredAmount, // Convert string to number
            date: new Date(enteredDate),
        };

        // 3. LIFTING STATE UP
        // Execute the function passed down from the parent (App)
        props.onSaveExpenseData(expenseData);

        // 4. Two-Way Binding: Clear the form
        setEnteredTitle('');
        setEnteredAmount('');
        setEnteredDate('');
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-indigo-600 p-6 rounded-2xl shadow-lg mb-6">
            <h3 className="text-white font-bold text-lg mb-4">Add New Expense</h3>
            <form onSubmit={submitHandler}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-indigo-100 text-sm font-bold mb-1">Title</label>
                        <input
                            type="text"
                            value={enteredTitle}
                            onChange={titleChangeHandler}
                            className="w-full bg-white px-3 py-2 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            placeholder="e.g. Groceries"
                            required
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-indigo-100 text-sm font-bold mb-1">Amount</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={enteredAmount}
                            onChange={amountChangeHandler}
                            className="w-full bg-white px-3 py-2 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-indigo-100 text-sm font-bold mb-1">Date</label>
                        <input
                            type="date"
                            min="2023-01-01"
                            max="2026-12-31"
                            value={enteredDate}
                            onChange={dateChangeHandler}
                            className="w-full bg-white px-3 py-2 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            required
                        />
                    </div>
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-indigo-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-800 transition-colors border border-indigo-700"
                    >Add Expense</button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseForm;