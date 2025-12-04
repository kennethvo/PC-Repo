import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import expenseService from "./services/expenseService";
import DashboardPage from "./pages/DashboardPage";
import AddExpensePage from "./pages/AddExpensePage";
import Navigation from "./pages/Navigation";
import ReportSummary from "./components/ReportSummary";

function App() {
  // HOOKS MUST BE USED INSIDE THE <BrowserRouter> provided by main.jsx
  const navigate = useNavigate();

  // 1. State
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredYear, setFilteredYear] = useState('2025');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [savedReports, setSavedReports] = useState(() => {
    try {
      const stored = localStorage.getItem('mySavedReports');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // 2. Effects
  useEffect(() => { localStorage.setItem('mySavedReports', JSON.stringify(savedReports)); }, [savedReports]);

  useEffect(() => {
    async function fetchExpenses() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await expenseService.getAll();
        const transformedData = data.map(item => ({ ...item, date: new Date(item.date) }));
        setExpenses(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  // 3. Handlers
  const addExpenseHandler = async (expenseData) => {
    setIsLoading(true);
    try {
      const newExpense = await expenseService.create(expenseData);
      const expenseWithDateObj = { ...newExpense, date: new Date(newExpense.date) };
      setExpenses((prev) => [expenseWithDateObj, ...prev]);
      navigate('/dashboard'); // Redirect after add
    } catch (err) {
      setError("Could not save expense.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpenseHandler = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const saveReportHandler = (reportData) => {
    setSavedReports((prev) => [reportData, ...prev]);
    setIsReportVisible(false);
    setSelectedIds([]);
  };

  const filteredExpenses = expenses.filter((expense) => {
    return expense.date.getFullYear().toString() === filteredYear;
  });

  const reportExpenses = filteredExpenses.filter(expense => selectedIds.includes(expense.id));

  // 4. Render
  // NOTE: No <BrowserRouter> here! It is in main.jsx.
  return (
    <div className="min-h-screen bg-slate-700 font-sans text-slate-800 pb-12">
      <Navigation />

      <Routes>
        <Route path="/dashboard" element={
          <DashboardPage
            expenses={filteredExpenses}
            filteredYear={filteredYear}
            setFilteredYear={setFilteredYear}
            selectedIds={selectedIds}
            toggleExpenseHandler={toggleExpenseHandler}
            savedReports={savedReports}
            deleteReportHandler={(id) => setSavedReports(prev => prev.filter(r => r.id !== id))}
            onOpenReport={() => setIsReportVisible(true)}
            isLoading={isLoading}
            error={error}
          />
        } />

        <Route path="/add-expense" element={
          <AddExpensePage
            onAddExpense={addExpenseHandler}
            isLoading={isLoading}
          />
        } />

        {/* Default Redirect */}
        <Route path="/" element={
          <div className="text-center mt-20">
            <h2 className="text-xl font-bold mb-4">Welcome to Expense Tracker</h2>
            <Link to="/dashboard" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold">Go to Dashboard</Link>
          </div>
        } />
      </Routes>

      {isReportVisible && (
        <ReportSummary
          selectedExpenses={reportExpenses}
          onClose={() => setIsReportVisible(false)}
          onSave={saveReportHandler}
        />
      )}
    </div>
  );
}

export default App;