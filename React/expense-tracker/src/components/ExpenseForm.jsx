import { useState } from "react";

const ExpenseForm = (prop) => {
    // We want to ...
    // accept a new expense from the user
    // with a title, amount, and date
    // and add it to the list (and create a new id/key for it)

    const [enteredTitle, setEnteredTitle] = useState('');
    const [enteredAmount, setEnteredAmount] = useState('');
    const [enteredDate, setEnteredDate] = useState('');

    const titleChangeHandler = (event) => {
        setEnteredTitle(event.target.value);
    }

    const amountChangeHandler = (event) => {
        setEnteredAmount(event.target.value);
    }

    const dateChangeHandler = (event) => {
        setEnteredDate(event.target.value);
    }

    const submitHandler = (event) => {
        event.preventDefault();

        const expenseData = {
            title: enteredTitle,
            amount: enteredAmount,
            date: new Date(enteredDate)
        };
        console.log(expenseData);

        prop.onSaveExpenseData(expenseData);
    }

    return (
        <div className="w-full mx-auto max-w-2xl bg-indigo-600 p-6 rounded-2xl shadow-lg">
            <h3 className="text-white font-bold text-lg">New Expense Form</h3>
            <form onSubmit={submitHandler} >
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2 gap-4 mb-4">
                        {/* title, amount, date */}
                        <label
                            className="blocktext-indigo-100 text-sm font-bold">Title</label>
                        <input
                            type="text"
                            value={enteredTitle}
                            onChange={titleChangeHandler}
                            placeholder="e.g. Fuel"
                            className="w-full bg-white px-3 py-2 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            required
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-indigo-100 text-sm font-bold">Amount</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={enteredAmount}
                            onChange={amountChangeHandler}
                            placeholder="0.00"
                            className="w-full bg-white px-3 py-2 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-indigo-100 text-sm font-bold">Date</label>
                        <input
                            type="date"
                            min="2022-01-01"
                            max="2035-12-31"
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
                        className=" bg-indigo-900 text-white font-bold rounded-lg py-2 px-6 hover:bg-indigo-700 hover:border-indigo-600 transition-colors border border-indigo-700">
                        Add Expense</button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseForm