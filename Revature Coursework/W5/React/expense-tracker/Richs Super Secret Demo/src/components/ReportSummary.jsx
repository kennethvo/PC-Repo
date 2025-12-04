// --- COMPONENT 1: ReportSummary (The "Report") ---
// Updated to include a "Save" button

const ReportSummary = ({ selectedExpenses, onClose, onSave }) => {
  const totalAmount = selectedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const reportDate = new Date().toLocaleDateString();

  const handleSave = () => {
    const reportData = {
      id: Math.random().toString(),
      date: reportDate,
      total: totalAmount,
      itemCount: selectedExpenses.length,
    };
    onSave(reportData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-indigo-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Expense Report</h2>
            <p className="text-indigo-200 text-sm">Generated on {reportDate}</p>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white font-bold text-xl">&times;</button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-500 text-sm uppercase">
                <th className="py-2">Date</th>
                <th className="py-2">Item</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedExpenses.map(exp => (
                <tr key={exp.id} className="border-b border-slate-50">
                  <td className="py-3 text-slate-500 text-sm">{exp.date.toLocaleDateString()}</td>
                  <td className="py-3 font-medium text-slate-800">{exp.title}</td>
                  <td className="py-3 text-right font-mono text-slate-700">${exp.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-50">
                <td colSpan="2" className="py-4 pl-4 font-bold text-indigo-900">Total Approved</td>
                <td className="py-4 text-right font-bold text-indigo-900 pr-2 text-xl">${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 bg-slate-50 text-right border-t flex justify-end gap-2">
           <button 
            onClick={() => window.print()} 
            className="text-indigo-600 font-bold hover:bg-indigo-100 px-4 py-2 rounded transition-colors"
          >
            Print
          </button>
          <button 
            onClick={handleSave}
            className="bg-emerald-600 text-white font-bold px-4 py-2 rounded hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
          >
            Save Report
          </button>
          <button 
            onClick={onClose}
            className="bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportSummary;