import { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/Expenses/ExpenseList'
import ExpenseFilter from './components/Expenses/ExpenseFilter'
import ReportSummary from './components/ReportSummary'
import SavedReportsList from './components/SavedReportsList'

const Dummy_Expenses = [
  {
    id: "e1",
    title: "Testing",
    amount: "123",
    date: new Date(2023, 0, 1),
  },
  {
    id: "e2",
    title: "Testing2",
    amount: "234",
    date: new Date(2023, 0, 1),
  },
  {
    id: "e3",
    title: "Testing3",
    amount: "345",
    date: new Date(2023, 0, 1),
  },
  {
    id: "e4",
    title: "Testing4",
    amount: "456",
    date: new Date(2023, 2, 1),
  },
]

function App() {

  const [expenses, setExpenses] = useState(Dummy_Expenses);
  const [filteredYear, setFilteredYear] = useState('2023');
  const [selectedIds, setSelectedIds] = useState([]);
  const [saveReports, setSaveReports] = useState(() => {
    try {
      const savedReports = localStorage.getItem('savedReports');
      return savedReports ? JSON.parse(savedReports) : [];
    } catch (error) {
      console.warn("failed to retrieve from local storage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('savedReports', JSON.stringify(saveReports));
  }, [saveReports]);

  const deleteReportHandler = (id) => {
    setSaveReports((prevReports) => prevReports.filter((report) => report.id !== id));
  };

  const addExpenseHandler = (expense) => {
    const expenseWithId = { ...expense, id: Math.random().toString() }

    setExpenses((prevExpenses) => {
      return [expenseWithId, ...prevExpenses] //pervious expenses is an array/collection
      // [ expense, old expense 1, old expense 2, old expense 3 ]
      // return [expenseWithId, prevExpenses] //
      //  [ expense, Array of Expenses ]
    })
  };

  const filterChangeHandler = (selectedYear) => {
    setFilteredYear(selectedYear);
  };

  const toggleExpenseHandler = (id) => {
    setSelectedIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const saveReportHandler = (report) => {
    setSaveReports((prevReports) => [...prevReports, report]); // adds new report to saved reports
    setSelectedIds([]); // clears all checkboxes when creating new report
  };

  const filteredExpenses = expenses.filter((expense) => {
    return expense.date.getFullYear().toString() === filteredYear;
  });

  const reportExpenses = expenses.filter((expense) => { return selectedIds.includes(expense.id); });

  return (
    <div className=" min-h-screen bg-slate-900 px-4 font-sans">
      <h1 className=" text-3xl text-slate-100 font-bold"> Testing testing, 123!</h1>

      <ExpenseFilter
        selected={filteredYear}
        onChangeFilter={filterChangeHandler} />
      <ExpenseForm
        onSaveExpenseData={addExpenseHandler} />
      <ExpenseList
        items={filteredExpenses}
        selectedIds={selectedIds}
        onToggleItem={toggleExpenseHandler} />
      <ReportSummary
        selectedExpenses={reportExpenses}
        onSave={saveReportHandler}
        closeHandler={() => setSelectedIds([])} />
      <SavedReportsList reports={saveReports}
        onDelete={deleteReportHandler} />
    </div>
  )
}

export default App
