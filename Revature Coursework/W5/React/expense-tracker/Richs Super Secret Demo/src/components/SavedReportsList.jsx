// --- NEW COMPONENT: SavedReportsList ---
// Displays the history of saved reports

const SavedReportsList = ({ reports, onDelete }) => {
    if (reports.length === 0) return null;

    return (
        <div className="mt-8 bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500 font-bold border-b pb-2 mb-4 uppercase text-xs tracking-wider">
                Saved Reports (Local Storage)
            </h3>
            <div className="grid gap-3">
                {reports.map(report => (
                    <div key={report.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors group">
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-700">Report #{report.id.substring(2, 6)}</span>
                            <span className="text-xs text-slate-500">Generated: {report.date} • {report.itemCount} items</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-indigo-700 font-mono font-bold text-lg">${report.total.toFixed(2)}</div>
                            {/* Added a Delete button to demonstrate state update + localStorage sync */}
                            <button
                                onClick={() => onDelete(report.id)}
                                className="text-red-400 hover:text-red-600 font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedReportsList;