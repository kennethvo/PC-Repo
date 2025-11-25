const ExpenseFilter = ({ selected, onChangeFilter }) => {
    return (
        <div className="flex justify-between items-center mb-4 px-2">
            <label className="text-white font-bold">
                Filter by year
            </label>
            <select
                className="bg-slate-800 text-white rounded-lg px-6 py-2 cursor-pointer border border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={selected}
                onChange={(event) => onChangeFilter(event.target.value)}>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                    <option value="2031">2031</option>
                    <option value="2032">2032</option>
                    <option value="2033">2033</option>
                    <option value="2034">2034</option>
                    <option value="2035">2035</option>
                </select>
        </div>
    );
}

export default ExpenseFilter;