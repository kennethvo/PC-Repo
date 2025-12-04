import ExpenseItem from "./ExpenseItem";

const ExpenseList = ({ items, selectedIds, onToggleItem, onDeleteItem }) => {
    if (items.length === 0) {
        return <h2 className = "text-2xl bg-slate-200 p-6 m-auto rounded-2xl shadow-inner font-bold text-slate-800">No expenses found.</h2>;
    };

    console.log(items);
    return (
        <div className = "w-full mx-auto bg-slate-200 p-6 rounded-2xl shadow-inner">
            { items.map ((expense) => (
                <ExpenseItem 
                    key = {expense.id}
                    id = {expense.id}
                    title = {expense.title}
                    amount = {expense.amount}
                    date = {expense.date} 
                    isSelected = {selectedIds.includes(expense.id)}
                    onToggle= {onToggleItem}
                    onDelete= {onDeleteItem}/>
            )) }
        </div>
    );
};

export default ExpenseList;