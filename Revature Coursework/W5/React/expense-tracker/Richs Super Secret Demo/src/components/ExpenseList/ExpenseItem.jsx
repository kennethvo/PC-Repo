// --- INSTRUCTOR NOTE: Create this in src/components/ExpenseItem.jsx ---
// This is a "Stateless" or "Dumb" component.
// It only cares about displaying the data passed to it via 'props'.

import ExpenseDate from '../ExpenseDate';

const ExpenseItem = ({ id, title, amount, date, isSelected, onToggle }) => {
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.toLocaleString('en-US', { day: '2-digit' });
    const year = date.getFullYear();

    return (
        <div className={`flex items-center justify-between p-3 my-3 rounded-xl shadow-sm transition-all duration-300 border-l-4 ${isSelected ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200' : 'bg-white border-transparent hover:shadow-md'}`}>
            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(id)}
                    className="w-5 h-5 accent-indigo-600 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center bg-slate-800 text-white rounded-xl w-16 h-16 shrink-0">
                    <div className="text-[9px] font-bold uppercase">{month}</div>
                    <div className="text-lg font-bold leading-none">{day}</div>
                    <div className="text-[9px] text-slate-300">{year}</div>
                </div>
                <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            </div>
            <div className="font-bold text-slate-600">
                ${amount.toFixed(2)}
            </div>
        </div>
    );
};

export default ExpenseItem;