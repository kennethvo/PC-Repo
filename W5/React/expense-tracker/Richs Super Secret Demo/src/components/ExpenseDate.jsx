// --- INSTRUCTOR NOTE: Create this in src/components/ExpenseDate.jsx ---
// This component isolates the complex date formatting logic.
// It demonstrates "Composition" - building complex UIs from small parts.

const ExpenseDate = ({ date }) => {
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.toLocaleString('en-US', { day: '2-digit' });
    const year = date.getFullYear();

    return (
        <div className="flex flex-col items-center justify-center bg-slate-800 text-white rounded-xl w-20 h-20 border border-slate-700 shadow-sm shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider">{month}</div>
            <div className="text-xl font-bold leading-none">{day}</div>
            <div className="text-[10px] text-slate-300">{year}</div>
        </div>
    );
};

export default ExpenseDate;