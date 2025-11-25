const ReportSummary = ({ selectedExpenses, closerHandler }) => {
    const totalAmount = selectedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const reportDate = new Date().toLocaleDateString();

    const saveHandler = () => {
        // create report object
        const report = {
            id: Math.random().toString(),
            date: reportDate(),
            total: totalAmount,
            expenseCount: selectedExpenses.length,
        };

        // pass report back to the app
        onSave(report);
    };

    return (
        <div>
            <div>
                {/* heading */}
                <h2>Expense Report</h2>
                <p>Report Date: {reportDate}</p>
            </div>
            <div>
                {/* table of expenses */}
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* each row is a selected expense */}
                        {selectedExpenses.map(exp => (
                            <tr key={exp.id}>
                                <td>{exp.date.toLocaleDateString()}</td>
                                <td>{exp.title}</td>
                                <td>${exp.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        {/* summary data */}
                        <tr>
                            <td>Total</td>
                            <td></td>
                            <td>${totalAmount}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div>
                {/* interactions */}
                <button onClick={saveHandler}>Save Report</button>
                <button onClick={closeHandler}>Close</button>
            </div>
        </div>
    );
};

export default ReportSummary;