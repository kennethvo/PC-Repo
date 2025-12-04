const ExpensesService = {
    baseUrl: "http://localhost:3000/expenses",

    // get, put, post, patch, delete

    async getAll() {
        console.log(this.baseUrl);
        const response = await fetch(this.baseUrl);
        console.log(response);
        if (!response.ok) {
            throw new Error('failed to fetch!');
        }
        return response.json();
    },
    async postExpense(expense) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense),
        });
        if (!response.ok) throw new Error('failed to save expense');
        return response.json();
    },
    async deleteExpense(id) {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('failed to delete expense');
        return response.json();
    }
};

export default ExpensesService;