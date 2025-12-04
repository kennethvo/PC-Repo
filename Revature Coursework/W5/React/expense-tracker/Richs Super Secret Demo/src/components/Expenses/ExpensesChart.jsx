// --- COMPONENT 3: ExpensesChart (Data Logic) ---
// Bridges the gap between "Expenses" and the "Chart".
// Transforms the raw expense list into 12 monthly buckets.

import Chart from '../Chart/Chart';

const ExpensesChart = ({ expenses }) => {
  const chartDataPoints = [
    { label: 'Jan', value: 0 },
    { label: 'Feb', value: 0 },
    { label: 'Mar', value: 0 },
    { label: 'Apr', value: 0 },
    { label: 'May', value: 0 },
    { label: 'Jun', value: 0 },
    { label: 'Jul', value: 0 },
    { label: 'Aug', value: 0 },
    { label: 'Sep', value: 0 },
    { label: 'Oct', value: 0 },
    { label: 'Nov', value: 0 },
    { label: 'Dec', value: 0 },
  ];

  // Loop through expenses and sum up amounts for the correct month
  for (const expense of expenses) {
    const expenseMonth = expense.date.getMonth(); // 0 = Jan, 1 = Feb...
    chartDataPoints[expenseMonth].value += expense.amount;
  }

  return <Chart dataPoints={chartDataPoints} />;
};

export default ExpensesChart;