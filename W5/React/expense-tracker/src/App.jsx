import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/Expenses/ExpenseList'
import ExpenseFilter from './components/Expenses/ExpenseFilter'
import ReportSummary from './components/ReportSummary'
import SavedReportsList from './components/SavedReportsList'
import ExpensesService from './services/ExpensesService';
import Navigation from './components/pages/Navigation';
import SavedReportsPage from './components/pages/SavedReportsPage'
import ExpensesDashboard from './components/pages/ExpensesDashboard'

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
        console.warn("Failed to retrieve from server!", error);
        setError(error.message);
        // default?
      } finally {
        console.log("finally");
        setIsLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  const deleteExpenseHandler = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      ExpensesService.deleteExpense(id);
      setExpenses((prevExpenses) => prevExpenses.filter(expense => expense.id !== id));
    } catch (error) {
      setError(error.message);
      console.warn("Failed to delete from server!", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReportHandler = (id) => { // pass in the id to remove/delete
    setSavedReports((prevReports) => prevReports.filter(report => report.id !== id));
    // remove the report from the saved reports
  };

  const addExpenseHandler = async (expense) => {
    setIsLoading(true);
    setError(null);

    try {
      // run the post request, geting back the json of the new expense (with ID!)
      const newExpenseData = await ExpensesService.postExpense(expense);

      // unpack the json, and add the date to the new expense
      const expenseWithDate = { ...newExpenseData, date: new Date(newExpenseData.date) };

      // add the new expense to the list of all expenses
      setExpenses((prev) => [expenseWithDate, ...prev]);

    } catch (error) {
      setError('Failed to save expense! ' + error.message);
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
          element={ <ExpensesDashboard /> }
          />
        <Route 
          path="/reports"
          element= { <SavedReportsPage 
                        savedReports= {savedReports}
                        deleteReportHandler = {deleteReportHandler}/>}
          />
        <Route
          path="/"
          element={
            <div>
              <Link to ="/dashboard">Go To Dashboard</Link>
            </div>} />
      </Routes>
    </div>
  )
}

export default App
