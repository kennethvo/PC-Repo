# React Component Creation - Comprehensive Study Guide

## 🎯 **OVERVIEW**

This guide breaks down React component creation step-by-step using examples from your codebase. Master these patterns to confidently complete component exercises in your assessment.

**Reference Files:**
- `W5/React/expense-tracker/src/components/ExpenseForm.jsx` - Form component with state
- `W5/React/expense-tracker/src/App.jsx` - Main app with hooks and handlers
- `W5/React/expense-tracker/src/components/Expenses/ExpenseList.jsx` - List component
- `W5/React/expense-tracker/src/components/Expenses/ExpenseItem.jsx` - Item component
- `W5/React/expense-tracker/src/components/Expenses/ExpenseFilter.jsx` - Filter component

---

## 📋 **COMPONENT STRUCTURE - THE TEMPLATE**

Every React component follows this structure:

```jsx
// 1. IMPORTS
import { useState, useEffect } from 'react';

// 2. COMPONENT FUNCTION
function ComponentName(props) {
    // 3. STATE (if needed)
    const [state, setState] = useState(initialValue);
    
    // 4. EFFECTS (if needed)
    useEffect(() => {
        // Side effects
    }, [dependencies]);
    
    // 5. EVENT HANDLERS (if needed)
    const handleSomething = (event) => {
        // Handler logic
    };
    
    // 6. RETURN JSX
    return (
        <div>
            {/* JSX content */}
        </div>
    );
}

// 7. EXPORT
export default ComponentName;
```

---

## 🔑 **STEP 1: UNDERSTANDING PROPS**

### **What are Props?**

Props are data passed from parent to child component. They are **read-only** - child cannot modify them.

**Reference**: `W5/React/expense-tracker/src/components/Expenses/ExpenseList.jsx`

```jsx
// Parent passes data down
<ExpenseList items={expenses} onDeleteItem={deleteHandler} />

// Child receives props
const ExpenseList = ({ items, onDeleteItem }) => {
    return (
        <div>
            {items.map(item => (
                <ExpenseItem key={item.id} item={item} onDelete={onDeleteItem} />
            ))}
        </div>
    );
};
```

### **Props Patterns:**

**1. Destructuring Props:**
```jsx
// Method 1: Destructure in function parameters
function ExpenseItem({ id, title, amount, onDelete }) {
    return <div>{title}</div>;
}

// Method 2: Destructure inside function
function ExpenseItem(props) {
    const { id, title, amount, onDelete } = props;
    return <div>{title}</div>;
}
```

**2. Passing Props:**
```jsx
// Parent component
function App() {
    const expenses = [{ id: 1, title: "Food", amount: 50 }];
    
    return (
        <ExpenseList 
            items={expenses}           // Pass array
            onDelete={handleDelete}   // Pass function
            selectedYear="2023"        // Pass string
        />
    );
}
```

---

## 🔑 **STEP 2: UNDERSTANDING STATE (useState)**

### **What is State?**

State is data that can change over time. When state changes, React re-renders the component.

**Reference**: `W5/React/expense-tracker/src/components/ExpenseForm.jsx` (lines 9-11)

```jsx
import { useState } from 'react';

function ExpenseForm() {
    // State for form inputs
    const [enteredTitle, setEnteredTitle] = useState('');
    const [enteredAmount, setEnteredAmount] = useState('');
    const [enteredDate, setEnteredDate] = useState('');
    
    // useState returns: [currentValue, setterFunction]
    // enteredTitle = current value
    // setEnteredTitle = function to update value
}
```

### **useState Patterns:**

**1. Basic State:**
```jsx
const [count, setCount] = useState(0);
// count = 0 (initial value)
// setCount(5) → count becomes 5
```

**2. State with Initial Function:**
```jsx
// Reference: App.jsx (lines 19-27)
const [savedReports, setSavedReports] = useState(() => {
    try {
        const saved = localStorage.getItem('savedReports');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        return [];
    }
});
// Function runs only once on initial render
```

**3. Updating State:**
```jsx
// Direct update
setCount(5);

// Update based on previous value (IMPORTANT!)
setCount(prevCount => prevCount + 1);

// For arrays
setExpenses(prevExpenses => [...prevExpenses, newExpense]);
setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== id));

// For objects
setUser(prevUser => ({ ...prevUser, name: 'John' }));
```

---

## 🔑 **STEP 3: EVENT HANDLERS**

### **What are Event Handlers?**

Functions that respond to user interactions (clicks, form submissions, input changes).

**Reference**: `W5/React/expense-tracker/src/components/ExpenseForm.jsx` (lines 13-39)

```jsx
function ExpenseForm({ onSaveExpenseData }) {
    const [title, setTitle] = useState('');
    
    // Input change handler
    const titleChangeHandler = (event) => {
        setTitle(event.target.value);  // Update state with input value
    };
    
    // Form submission handler
    const submitHandler = (event) => {
        event.preventDefault();  // CRITICAL: Prevents page reload
        
        const expenseData = {
            title: title,
            amount: amount,
            date: new Date(date)
        };
        
        onSaveExpenseData(expenseData);  // Call parent function
    };
    
    return (
        <form onSubmit={submitHandler}>
            <input 
                value={title}                    // Controlled input
                onChange={titleChangeHandler}    // Handler on change
            />
            <button type="submit">Submit</button>
        </form>
    );
}
```

### **Event Handler Patterns:**

**1. Input Change Handler:**
```jsx
const [inputValue, setInputValue] = useState('');

const handleChange = (event) => {
    setInputValue(event.target.value);
};

<input value={inputValue} onChange={handleChange} />
```

**2. Button Click Handler:**
```jsx
const handleClick = () => {
    // Do something
};

<button onClick={handleClick}>Click Me</button>

// Or inline:
<button onClick={() => handleDelete(id)}>Delete</button>
```

**3. Form Submission Handler:**
```jsx
const handleSubmit = (event) => {
    event.preventDefault();  // ALWAYS prevent default for forms!
    // Process form data
};

<form onSubmit={handleSubmit}>
    <button type="submit">Submit</button>
</form>
```

**4. Checkbox Handler:**
```jsx
// Reference: ExpenseItem.jsx (lines 9-11)
const [isChecked, setIsChecked] = useState(false);

<input 
    type="checkbox"
    checked={isChecked}
    onChange={() => setIsChecked(!isChecked)}
/>
```

---

## 🔑 **STEP 4: CONTROLLED COMPONENTS**

### **What are Controlled Components?**

Inputs whose value is controlled by React state. The input value comes from state, and changes update state.

**Reference**: `W5/React/expense-tracker/src/components/ExpenseForm.jsx` (lines 50-83)

```jsx
function ExpenseForm() {
    const [enteredTitle, setEnteredTitle] = useState('');
    const [enteredAmount, setEnteredAmount] = useState('');
    
    const titleChangeHandler = (event) => {
        setEnteredTitle(event.target.value);
    };
    
    const amountChangeHandler = (event) => {
        setEnteredAmount(event.target.value);
    };
    
    return (
        <form>
            {/* Controlled input - value comes from state */}
            <input
                type="text"
                value={enteredTitle}              // State value
                onChange={titleChangeHandler}     // Update state on change
                placeholder="Title"
            />
            
            <input
                type="number"
                value={enteredAmount}
                onChange={amountChangeHandler}
                placeholder="Amount"
            />
        </form>
    );
}
```

**Pattern:**
1. Create state: `const [value, setValue] = useState('');`
2. Set input value: `value={value}`
3. Update on change: `onChange={(e) => setValue(e.target.value)}`

---

## 🔑 **STEP 5: useEffect HOOK**

### **What is useEffect?**

Hook that runs side effects (API calls, subscriptions, DOM manipulation) after render.

**Reference**: `W5/React/expense-tracker/src/App.jsx` (lines 31-57)

```jsx
import { useEffect } from 'react';

function App() {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Run once on mount (empty dependency array)
    useEffect(() => {
        async function fetchExpenses() {
            setIsLoading(true);
            try {
                const data = await ExpensesService.getAll();
                setExpenses(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchExpenses();
    }, []);  // Empty array = run once on mount
    
    // Run when savedReports changes
    useEffect(() => {
        localStorage.setItem('savedReports', JSON.stringify(savedReports));
    }, [savedReports]);  // Run when savedReports changes
}
```

### **useEffect Patterns:**

**1. Run Once on Mount:**
```jsx
useEffect(() => {
    // Fetch data, setup subscriptions
    fetchData();
}, []);  // Empty array = run once
```

**2. Run When Dependency Changes:**
```jsx
useEffect(() => {
    // Save to localStorage when data changes
    localStorage.setItem('key', JSON.stringify(data));
}, [data]);  // Run when 'data' changes
```

**3. Cleanup Function:**
```jsx
useEffect(() => {
    const timer = setInterval(() => {
        // Do something
    }, 1000);
    
    // Cleanup function
    return () => {
        clearInterval(timer);
    };
}, []);
```

---

## 🔑 **STEP 6: RENDERING LISTS**

### **How to Render Lists**

Use `.map()` to transform arrays into JSX elements. **Always include `key` prop!**

**Reference**: `W5/React/expense-tracker/src/components/Expenses/ExpenseList.jsx` (lines 10-20)

```jsx
function ExpenseList({ items, onDeleteItem }) {
    return (
        <div>
            {items.map((expense) => (
                <ExpenseItem 
                    key={expense.id}              // REQUIRED: unique key
                    id={expense.id}
                    title={expense.title}
                    amount={expense.amount}
                    onDelete={onDeleteItem}
                />
            ))}
        </div>
    );
}
```

### **List Rendering Patterns:**

**1. Basic List:**
```jsx
const items = ['Apple', 'Banana', 'Orange'];

return (
    <ul>
        {items.map((item, index) => (
            <li key={index}>{item}</li>
        ))}
    </ul>
);
```

**2. List with Objects:**
```jsx
const expenses = [
    { id: 1, title: 'Food', amount: 50 },
    { id: 2, title: 'Gas', amount: 30 }
];

return (
    <div>
        {expenses.map(expense => (
            <div key={expense.id}>
                <h3>{expense.title}</h3>
                <p>${expense.amount}</p>
            </div>
        ))}
    </div>
);
```

**3. Conditional Rendering in Lists:**
```jsx
// Reference: ExpenseList.jsx (lines 4-6)
if (items.length === 0) {
    return <h2>No expenses found.</h2>;
}

return (
    <div>
        {items.map(item => <ExpenseItem key={item.id} item={item} />)}
    </div>
);
```

---

## 🔑 **STEP 7: CONDITIONAL RENDERING**

### **How to Conditionally Render**

Show/hide elements based on conditions.

**Patterns:**

**1. && Operator (Short Circuit):**
```jsx
{isLoading && <div>Loading...</div>}
{error && <div>Error: {error}</div>}
{items.length > 0 && <ExpenseList items={items} />}
```

**2. Ternary Operator:**
```jsx
{isLoading ? (
    <div>Loading...</div>
) : (
    <ExpenseList items={expenses} />
)}

{isSelected ? 'Selected' : 'Not Selected'}
```

**3. Early Return:**
```jsx
function ExpenseList({ items }) {
    if (items.length === 0) {
        return <h2>No expenses found.</h2>;
    }
    
    return (
        <div>
            {items.map(item => <ExpenseItem key={item.id} item={item} />)}
        </div>
    );
}
```

---

## 🔑 **STEP 8: COMPONENT INTERACTION**

### **Parent to Child (Props Down):**

**Reference**: `W5/React/expense-tracker/src/App.jsx` (lines 136-138)

```jsx
// Parent (App.jsx)
function App() {
    const [expenses, setExpenses] = useState([]);
    
    return (
        <ExpenseList 
            items={expenses}              // Pass data down
            onDeleteItem={deleteHandler}  // Pass function down
        />
    );
}

// Child (ExpenseList.jsx)
function ExpenseList({ items, onDeleteItem }) {
    return (
        <div>
            {items.map(item => (
                <ExpenseItem 
                    key={item.id}
                    item={item}
                    onDelete={onDeleteItem}  // Pass function further down
                />
            ))}
        </div>
    );
}
```

### **Child to Parent (Callbacks Up):**

**Reference**: `W5/React/expense-tracker/src/components/ExpenseForm.jsx` (line 38)

```jsx
// Parent (App.jsx)
function App() {
    const addExpenseHandler = async (expense) => {
        // Handle adding expense
        const newExpense = await ExpensesService.postExpense(expense);
        setExpenses(prev => [newExpense, ...prev]);
    };
    
    return (
        <ExpenseForm onSaveExpenseData={addExpenseHandler} />  // Pass callback
    );
}

// Child (ExpenseForm.jsx)
function ExpenseForm({ onSaveExpenseData }) {
    const submitHandler = (event) => {
        event.preventDefault();
        const expenseData = { title, amount, date };
        onSaveExpenseData(expenseData);  // Call parent function
    };
    
    return <form onSubmit={submitHandler}>...</form>;
}
```

---

## 📝 **ASSESSMENT-STYLE PRACTICE QUESTIONS**

### **Question 1: Complete a Form Component**

**Given:**
```jsx
import { useState } from 'react';

function UserForm({ onSubmit }) {
    // YOUR CODE HERE
    // 1. Create state for name and email
    // 2. Create change handlers
    // 3. Create submit handler
    // 4. Return form with controlled inputs
    
    return (
        <form>
            {/* YOUR CODE HERE */}
        </form>
    );
}

export default UserForm;
```

**Answer:**
```jsx
import { useState } from 'react';

function UserForm({ onSubmit }) {
    // 1. State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    // 2. Change handlers
    const nameChangeHandler = (event) => {
        setName(event.target.value);
    };
    
    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    };
    
    // 3. Submit handler
    const submitHandler = (event) => {
        event.preventDefault();
        onSubmit({ name, email });
        setName('');
        setEmail('');
    };
    
    // 4. Return form
    return (
        <form onSubmit={submitHandler}>
            <input
                type="text"
                value={name}
                onChange={nameChangeHandler}
                placeholder="Name"
            />
            <input
                type="email"
                value={email}
                onChange={emailChangeHandler}
                placeholder="Email"
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default UserForm;
```

---

### **Question 2: Complete a List Component**

**Given:**
```jsx
function ProductList({ products, onDelete }) {
    // YOUR CODE HERE
    // 1. Check if products array is empty
    // 2. Map products to ProductItem components
    // 3. Pass key, product data, and onDelete handler
    
    return (
        <div>
            {/* YOUR CODE HERE */}
        </div>
    );
}

export default ProductList;
```

**Answer:**
```jsx
function ProductList({ products, onDelete }) {
    // 1. Check if empty
    if (products.length === 0) {
        return <h2>No products found.</h2>;
    }
    
    // 2. Map products
    return (
        <div>
            {products.map((product) => (
                <ProductItem
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default ProductList;
```

---

### **Question 3: Complete useEffect for Data Fetching**

**Given:**
```jsx
import { useState, useEffect } from 'react';
import ProductService from './services/ProductService';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // YOUR CODE HERE
    // Complete useEffect to fetch products on mount
    // Handle loading and error states
    
    useEffect(() => {
        // YOUR CODE HERE
    }, []);
    
    if (isLoading) return <div>Loading...</div>;
    
    return (
        <div>
            {products.map(product => (
                <div key={product.id}>{product.name}</div>
            ))}
        </div>
    );
}
```

**Answer:**
```jsx
useEffect(() => {
    async function fetchProducts() {
        setIsLoading(true);
        try {
            const data = await ProductService.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchProducts();
}, []);  // Empty array = run once on mount
```

---

### **Question 4: Complete an Event Handler**

**Given:**
```jsx
function ExpenseItem({ expense, onDelete, onUpdate }) {
    // YOUR CODE HERE
    // Complete handleDelete function
    // Complete handleUpdate function
    
    const handleDelete = () => {
        // YOUR CODE HERE
    };
    
    const handleUpdate = () => {
        // YOUR CODE HERE
    };
    
    return (
        <div>
            <h3>{expense.title}</h3>
            <p>${expense.amount}</p>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleUpdate}>Update</button>
        </div>
    );
}
```

**Answer:**
```jsx
const handleDelete = () => {
    onDelete(expense.id);
};

const handleUpdate = () => {
    onUpdate(expense.id, { ...expense, amount: expense.amount * 1.1 });
};
```

---

### **Question 5: Complete a Filter Component**

**Given:**
```jsx
function YearFilter({ selectedYear, onYearChange }) {
    // YOUR CODE HERE
    // Create select dropdown with years 2020-2030
    // Use controlled component pattern
    // Call onYearChange when selection changes
    
    return (
        <div>
            <label>Filter by Year</label>
            {/* YOUR CODE HERE */}
        </div>
    );
}
```

**Answer:**
```jsx
function YearFilter({ selectedYear, onYearChange }) {
    return (
        <div>
            <label>Filter by Year</label>
            <select
                value={selectedYear}
                onChange={(event) => onYearChange(event.target.value)}
            >
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                <option value="2030">2030</option>
            </select>
        </div>
    );
}
```

---

### **Question 6: Complete State Updates**

**Given:**
```jsx
function ShoppingCart() {
    const [items, setItems] = useState([]);
    
    // YOUR CODE HERE
    // Complete addItem function
    // Complete removeItem function
    // Complete updateQuantity function
    
    const addItem = (item) => {
        // YOUR CODE HERE - Add item to items array
    };
    
    const removeItem = (itemId) => {
        // YOUR CODE HERE - Remove item from items array
    };
    
    const updateQuantity = (itemId, newQuantity) => {
        // YOUR CODE HERE - Update quantity of specific item
    };
    
    return (
        <div>
            {items.map(item => (
                <div key={item.id}>
                    {item.name} - Qty: {item.quantity}
                </div>
            ))}
        </div>
    );
}
```

**Answer:**
```jsx
const addItem = (item) => {
    setItems(prevItems => [...prevItems, item]);
};

const removeItem = (itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
};

const updateQuantity = (itemId, newQuantity) => {
    setItems(prevItems =>
        prevItems.map(item =>
            item.id === itemId
                ? { ...item, quantity: newQuantity }
                : item
        )
    );
};
```

---

### **Question 7: Complete Conditional Rendering**

**Given:**
```jsx
function UserProfile({ user, isLoading, error }) {
    // YOUR CODE HERE
    // Show loading message if isLoading is true
    // Show error message if error exists
    // Show user profile if user exists
    // Show "No user found" if user is null
    
    return (
        <div>
            {/* YOUR CODE HERE */}
        </div>
    );
}
```

**Answer:**
```jsx
function UserProfile({ user, isLoading, error }) {
    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error: {error}</div>;
    }
    
    if (!user) {
        return <div>No user found.</div>;
    }
    
    return (
        <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
}
```

---

### **Question 8: Complete Component with Props and State**

**Given:**
```jsx
function Counter({ initialCount, onCountChange }) {
    // YOUR CODE HERE
    // 1. Create state for count, initialize with initialCount
    // 2. Create increment handler
    // 3. Create decrement handler
    // 4. Call onCountChange whenever count changes (use useEffect)
    // 5. Return buttons and display
    
    return (
        <div>
            {/* YOUR CODE HERE */}
        </div>
    );
}
```

**Answer:**
```jsx
import { useState, useEffect } from 'react';

function Counter({ initialCount, onCountChange }) {
    const [count, setCount] = useState(initialCount);
    
    const increment = () => {
        setCount(prevCount => prevCount + 1);
    };
    
    const decrement = () => {
        setCount(prevCount => prevCount - 1);
    };
    
    useEffect(() => {
        onCountChange(count);
    }, [count, onCountChange]);
    
    return (
        <div>
            <button onClick={decrement}>-</button>
            <span>{count}</span>
            <button onClick={increment}>+</button>
        </div>
    );
}
```

---

## 🎯 **COMMON PATTERNS TO MEMORIZE**

### **1. Form Component Pattern:**
```jsx
function MyForm({ onSubmit }) {
    const [field1, setField1] = useState('');
    const [field2, setField2] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ field1, field2 });
        setField1('');
        setField2('');
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input value={field1} onChange={(e) => setField1(e.target.value)} />
            <input value={field2} onChange={(e) => setField2(e.target.value)} />
            <button type="submit">Submit</button>
        </form>
    );
}
```

### **2. List Component Pattern:**
```jsx
function MyList({ items, onDelete }) {
    if (items.length === 0) {
        return <div>No items found.</div>;
    }
    
    return (
        <div>
            {items.map(item => (
                <MyItem key={item.id} item={item} onDelete={onDelete} />
            ))}
        </div>
    );
}
```

### **3. useEffect Fetch Pattern:**
```jsx
useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        try {
            const data = await Service.getAll();
            setData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
}, []);
```

### **4. State Update Patterns:**
```jsx
// Add to array
setItems(prev => [...prev, newItem]);

// Remove from array
setItems(prev => prev.filter(item => item.id !== id));

// Update in array
setItems(prev => prev.map(item => 
    item.id === id ? { ...item, ...updates } : item
));

// Update object
setUser(prev => ({ ...prev, name: 'New Name' }));
```

---

## ✅ **CHECKLIST FOR COMPONENT CREATION**

When creating a component, ask yourself:

- [ ] **Imports**: Did I import useState, useEffect if needed?
- [ ] **Props**: Did I destructure props correctly?
- [ ] **State**: Do I need state? What should be in state?
- [ ] **Event Handlers**: Do I need handlers? Did I prevent default for forms?
- [ ] **Controlled Inputs**: Are my inputs controlled (value + onChange)?
- [ ] **useEffect**: Do I need side effects? What dependencies?
- [ ] **Lists**: Did I use .map() with key prop?
- [ ] **Conditional Rendering**: Did I handle empty/loading/error states?
- [ ] **Component Interaction**: How does this component communicate with parent/children?
- [ ] **Export**: Did I export the component?

---

## 🚨 **COMMON MISTAKES TO AVOID**

1. ❌ **Forgetting `key` prop in lists** → Always use `key={item.id}`
2. ❌ **Not preventing default in forms** → Always `e.preventDefault()`
3. ❌ **Mutating state directly** → Use setter functions, not `state.push()`
4. ❌ **Missing dependencies in useEffect** → Include all used variables
5. ❌ **Not handling async in useEffect** → Use async function inside useEffect
6. ❌ **Forgetting controlled inputs** → Always use `value` and `onChange`
7. ❌ **Not handling empty arrays** → Check `items.length === 0`
8. ❌ **Wrong state update pattern** → Use `prev =>` for arrays/objects

---

## 💡 **FINAL TIPS**

1. **Start with Structure**: Write the component skeleton first (imports, function, return, export)
2. **Add State**: Identify what needs to change → add useState
3. **Add Handlers**: Identify user interactions → add event handlers
4. **Add Effects**: Identify side effects → add useEffect
5. **Test Logic**: Walk through your code with example data
6. **Handle Edge Cases**: Empty arrays, null values, loading states

**Remember**: Pseudocode first, then code. Break down the problem into small steps!

---

**Good luck with your assessment! You've got this! 🚀**
