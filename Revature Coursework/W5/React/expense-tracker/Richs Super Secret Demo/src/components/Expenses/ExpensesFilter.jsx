// --- COMPONENT 4: ExpensesFilter (Controlled Component) ---
const ExpensesFilter = ({ selected, onChangeFilter }) => {
    return (
        <div className="flex justify-between items-center mb-4 px-2">
            <label className="text-slate-300 font-bold">Filter by year</label>
            <select
                value={selected}
                onChange={(event) => onChangeFilter(event.target.value)}
                className="py-2 px-6 rounded-lg font-bold cursor-pointer bg-slate-800 text-white border border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
            </select>
        </div>
    );
};

export default ExpensesFilter;