import ExpenseFilter from './../Expenses/ExpenseFilter'
import ExpenseForm from './../ExpenseForm'
import ExpenseList from './../Expenses/ExpenseList'
import ReportSummary from './../ReportSummary'

const ExpenseDashboard = () => {
    return (
        <div>
            <div>
                <h1>Expenses Dashboard</h1>
            </div>
            <div className=" min-h-screen bg-slate-900 px-4 font-sans">
                <ExpenseFilter
                    selected={filteredYear}
                    onChangeFilter={filterChangeHandler} />
                <ExpenseForm
                    onSaveExpenseData={addExpenseHandler} />
                <ExpenseList
                    items={filteredExpenses}
                    selectedIds={selectedIds}
                    onToggleItem={toggleExpenseHandler}
                    onDeleteItem={deleteExpenseHandler} />
                <ReportSummary
                    selectedExpenses={reportExpenses}
                    onSave={saveReportHandler}
                    closeHandler={() => setSelectedIds([])} />
            </div>
        </div>
    );
};

export default ExpenseDashboard;