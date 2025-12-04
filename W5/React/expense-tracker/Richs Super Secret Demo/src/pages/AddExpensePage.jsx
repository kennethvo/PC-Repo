import ExpenseForm from "../components/ExpenseForm/ExpenseForm";

const AddExpensePage = ({ onAddExpense, isLoading }) => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <ExpenseForm onSaveExpenseData={onAddExpense} isLoading={isLoading} />
    </div>
  );
};

export default AddExpensePage;