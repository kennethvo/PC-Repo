import ExpensesFilter from "../components/Expenses/ExpensesFilter";
import ExpenseList from "../components/ExpenseList/ExpenseList";
import SavedReportsList from "../components/SavedReportsList";
import ExpenseChart from "../components/Expenses/ExpensesChart";
import ReportSummary from "../components/ReportSummary";

const DashboardPage = ({
  expenses,
  filteredYear, setFilteredYear,
  selectedIds, toggleExpenseHandler,
  savedReports, deleteReportHandler,
  onOpenReport,
  isLoading, error
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <button
          onClick={onOpenReport}
          disabled={selectedIds.length === 0}
          className={`px-6 py-2 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 ${selectedIds.length > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
        >
          <span>Generate Report</span>
          {selectedIds.length > 0 && <span className="bg-indigo-800 text-xs px-2 py-1 rounded-full">{selectedIds.length}</span>}
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>}

      <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200">
        <ExpensesFilter selected={filteredYear} onChangeFilter={setFilteredYear} />
        <ExpenseChart expenses={expenses} />
        <h3 className="text-slate-500 font-bold border-b pb-2 mb-2 uppercase text-xs tracking-wider">Expenses</h3>
        {isLoading && !error && <div className="text-center py-8 text-indigo-500 font-bold animate-pulse">Loading Expenses...</div>}
        {!isLoading && <ExpenseList items={expenses} selectedIds={selectedIds} onToggleItem={toggleExpenseHandler} />}
      </div>

      <SavedReportsList reports={savedReports} onDelete={deleteReportHandler} />
    </div>
  );
};

export default DashboardPage;