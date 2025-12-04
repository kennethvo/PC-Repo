const ExpenseDate = ({ date }) => {
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.toLocaleString('en-US', { day: '2-digit' });
    const year = date.getFullYear();

    return (
        <div className = "flex flex-col items-center justify-center bg-slate-800 rounded-xl text-white w-25 h-25 border border-slate-700 shadow-sm ">
            <div>{month}</div>
            <div>{day}</div>
            <div>{year}</div>
        </div>
    );
};

export default ExpenseDate;