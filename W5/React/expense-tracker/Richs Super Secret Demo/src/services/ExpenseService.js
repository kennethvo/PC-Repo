// ==========================================
// 1. THE SERVICE LAYER (src/services/expenseService.js)
// ==========================================
// INSTRUCTOR NOTE: Have students put this object in a separate file
// named 'expenseService.js' and export it.

const expenseService = {
  baseUrl: 'http://localhost:3000/expenses',

  // GET all expenses
  async getAll() {
    console.log(this.baseUrl);
    const response = await fetch(this.baseUrl);
    console.log(response);
    if (!response.ok) throw new Error('Failed to fetch expenses.');
    return response.json();
  },

  // POST a new expense
  async create(expenseData) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) throw new Error('Failed to save expense.');
    return response.json();
  }
};

export default expenseService;