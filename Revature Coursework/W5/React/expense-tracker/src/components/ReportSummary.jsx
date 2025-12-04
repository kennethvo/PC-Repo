const ReportSummary = ({ selectedExpenses, closeHandler, onSave }) => {
    const totalAmount = selectedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const reportDate = new Date().toLocaleDateString();

    const saveHandler = () => {
        // create a report object
        const report = {
            id: Math.random().toString(),
            date: reportDate,
            total: totalAmount,
            expenseCount: selectedExpenses.length,
        }; 

        // pass the report back to the app
        onSave(report);
    };

    return (
        <div className='bg-slate-200 p-6 my-5 rounded-2xl shadow-inner w-full'>
            <div className='bg-indigo-900 text-white p-6 flex justify-between items-center'>
                {/* heading */}
                <h2>Expense Report</h2>
                <p>Report Date: {reportDate}</p>
            </div>
            <div className="w-full text-left border-collapse">
                {/* table of expenses */}
                <table className = "w-full text-left ">
                    <thead>
                    <tr>
                        <th className="py-2 ">Date</th>
                        <th className="py-2 ">Title</th>
                        <th className="py-2 text-right">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                        {/* each row is a slected expense */}
                        {selectedExpenses.map( exp => (
                        <tr key={exp.id}>
                            <td className="py-2 ">{exp.date.toLocaleDateString()}</td>
                            <td className="py-2 ">{exp.title}</td>
                            <td className="py-2 text-right">${exp.amount}</td>
                        </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        {/* summary data */}
                        <tr>
                            <td className="py-2 ">Total</td>                   <td></td>
                            <td className="py-2 text-right">${totalAmount}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="p-4 bg-slate-400 text-right border-t flex justify-end gap-2">
                {/* interactions */}
                <button
                className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors shadow-md flex items-center gap-2"
                onClick={saveHandler}>Save Report</button>
                <button
                
                className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors shadow-md flex items-center gap-2"
                onClick={closeHandler}>Close</button>
            </div>
        </div>
    );
};

export default ReportSummary;