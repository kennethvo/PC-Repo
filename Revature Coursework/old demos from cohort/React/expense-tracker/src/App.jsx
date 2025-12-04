import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/Expenses/ExpenseList'
import ExpenseFilter from './components/Expenses/ExpenseFilter'
import ReportSummary from './components/ReportSummary'
import SavedReportsList from './components/SavedReportsList'
import ExpensesService from './services/ExpensesService'
import ExpenseDashboard from './components/pages/ExpensesDashboard'
import SavedReportsPage from './components/pages/SavedReportsPage'
import Navigation from './components/pages/Navigation'

function App() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [filteredYear, setFilteredYear] = useState('2023');
  const [selectedIds, setSelectedIds] = useState([]);
  const [savedReports, setSavedReports] = useState(() => {
    try {
      const savedReports = localStorage.getItem('savedReports');
      return savedReports ? JSON.parse(savedReports) : [];
    } catch (error) {
      console.warn("failed to retrieve from local storage", error);
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('savedReports', JSON.stringify(savedReports));
  }, [savedReports]);

  useEffect(() => {
    async function fetchExpenses() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await ExpensesService.getAll();
        const transformedData = data.map(item => ({
          ...item,
          date: new Date(item.date)
        }));

        setExpenses(transformedData);
      } catch (error) {
        console.warn('failed to retrieve from server :(', error);
        setError(error.message);
        // default?
      } finally {
        console.log('finally');
        setIsLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  const deleteReportHandler = (id) => { // pass in the id to remove/delete
    setSavedReports((prevReports) => prevReports.filter(report => report.id !== id));
    // remove the report from the saved reports
  };

  const addExpenseHandler = async (expense) => {
    setIsLoading(true);
    setError(null);

    try {
      // run post req, get back the json of new expense (w id)
      const newExpense = await ExpensesService.postExpense(expense);

      // unpack json, add date to new expense
      const expenseWithDate = { ...newExpense, date: new Date(newExpense.date) };

      // add new expense to list of all expenses
      setExpenses((prev) => [expenseWithDate, ...prev]);

    } catch (error) {
      setError('failed to save expense', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpenseHandler = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      // run delete req
      await ExpensesService.deleteExpense(id);

      // remove expense from list of all expenses
      setExpenses((prev) => prev.filter(expense => expense.id !== id));

      // also remove from selectedIds if it was selected
      setSelectedIds((prevSelected) => prevSelected.filter(selectedId => selectedId !== id));

    } catch (error) {
      setError('failed to delete expense', error);
    } finally {
      setIsLoading(false);
    }
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
    setSavedReports(prevReports => [...prevReports, report]); // adds a new report to the saved reports
    setSelectedIds([]); // clears all of the checkboxes when we create a new report
  };

  const filteredExpenses = expenses.filter((expense) => {
    return expense.date.getFullYear().toString() === filteredYear;
  });

  const reportExpenses = expenses.filter((expense) => { return selectedIds.includes(expense.id); });

  return (
    <div>
      <Navigation />

      <Routes>
        <Route
          path="/dashboard"
          element={<ExpenseDashboard />}
        />
        <Route
          path="/reports"
          element={<SavedReportsPage
            savedReports={savedReports}
            deleteReportHandler={deleteReportHandler}
          />}
        />
        <Route
          path="/"
          element={
            <div>
              <Link to="/dashboard">Go to Dashboard</Link>
            </div>}
        />
      </Routes>

      
    </div>
  )
}

export default App
