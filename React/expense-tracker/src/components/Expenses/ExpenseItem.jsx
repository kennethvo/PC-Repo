import ExpenseDate from "./ExpenseDate";

const ExpenseItem = ({ title, amount, date }) => {
    return (
        <div className = " flex items-center justify-between bg-white rounded-xl p-3 border-indigo-500 border-l-4 hover:shadow-md">
            <div>
                <ExpenseDate date = {date} />
            </div>
            <h1>{title}</h1>
            <h2>{amount}</h2>
        </div>
    );
};

export default ExpenseItem;