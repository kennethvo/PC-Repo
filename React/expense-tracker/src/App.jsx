import { useState } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/Expenses/ExpenseList'
import ExpenseFilter from './components/Expenses/ExpenseFilter'

const Dummy_Expenses = [
  {
    id: "e1",
    title: "Testing",
    amount: "123",
    date: new Date("2023, 1, 1"),
  },
  {
    id: "e2",
    title: "Testing2",
    amount: "234",
    date: new Date("2023, 1, 1"),
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
    date: new Date("2023, 3, 1"),
  },
]

function App() {

  const [expenses, setExpenses] = useState(Dummy_Expenses);
  const [filteredYear, setFilteredYear] = useState('2023');

  const addExpenseHandler = (expense) => {
    const expenseWithId = { ...expense, id: Math.random().toString() }

    setExpenses((prevExpenses) => {
      return [expenseWithId, ...prevExpenses] //pervious expenses is an array/collection
      // [ expense, old expense 1, old expense 2, old expense 3 ]
      return [expenseWithId, prevExpenses] //
      //  [ expense, Array of Expenses ]
    })
  };

  const filterChangeHandler = (selectedYear) => {
    setFilteredYear(selectedYear);
  };

  const filteredExpenses = expenses.filter((expense) => {
    return expense.date.getFullYear().toString() === filteredYear;
  });

  return (
    <div className=" min-h-screen bg-slate-900 px-4 font-sans">
      <h1 className=" text-3xl text-slate-100 font-bold"> Testing testing, 123!</h1>
      <ExpenseFilter
        selected={ filteredYear }
        onChangeFilter={ filterChangeHandler } />
      <ExpenseForm
        onSaveExpenseData={ addExpenseHandler } />
      <ExpenseList
        items={ filteredExpenses } />
    </div>
  )
}

export default App
