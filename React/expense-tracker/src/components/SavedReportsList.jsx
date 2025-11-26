const SavedReportsList = ({ reports, onDelete }) => {

    if (reports.length === 0) {
        return null;
    };

    return (
        <div className='mt-8 bg-white p-6 rounded-2xl shadow-md border border-slate-200'>
            {/* display reports */}
            <h3 className='text-slate-500 font-bold border-b pb-2 mb-2 uppercase'>Saved Reports History</h3>
            {/* I need to display the reports by iterating through the collections? */}
            <div>{reports.map(report => (
                <div className='flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors'>
                    <div className="flex flex-col">
                        <p>Report {report.id.substring(2, 6)}</p>
                        <p>generated on {report.date} - {report.expenseCount} expenses</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-4'>
                            <p>${report.total}</p>
                        </div>
                        <div>
                            <button onClick={() => onDelete(report.id)} className='text-red-600 hover:text-red-800 font-bold text-lg rounded px-2 py-2'>X</button>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

export default SavedReportsList;