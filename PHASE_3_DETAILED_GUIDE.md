# Phase 3: Understanding React Frontend - Detailed Guide

## 🎯 **Overview**

This guide will walk you through Phase 3 of your study plan: **Understanding React Frontend**. We'll cover:

1. **React Fundamentals** - Components, JSX, props, state
2. **App.jsx** - Main component with state management and API calls
3. **ExpensesService.jsx** - Service layer for API communication
4. **ExpenseForm.jsx** - Form handling and controlled components
5. **Complete data flow** - How everything connects

---

## 📖 **PART 1: React Fundamentals**

### **1.1 What is React?**

**React** is a JavaScript library for building user interfaces, particularly single-page applications (SPAs).

**Key Characteristics:**
- **Component-Based**: Build reusable UI components
- **Declarative**: Describe what UI should look like, React handles how
- **Virtual DOM**: Efficient updates and rendering
- **Unidirectional Data Flow**: Data flows down from parent to child

**Why React for Full Stack?**
- **Frontend Layer**: Handles user interactions and displays data
- **API Communication**: Makes HTTP requests to backend (Spring Boot)
- **State Management**: Manages application state
- **Modern UI**: Creates dynamic, interactive user interfaces

### **1.2 Components - Building Blocks of React**

**Components** are reusable pieces of UI that return JSX (looks like HTML but is JavaScript).

**Functional Components (Modern Approach):**
```jsx
function ExpenseItem({ expense, onDelete }) {
  return (
    <div>
      <h3>{expense.title}</h3>
      <p>${expense.amount}</p>
      <button onClick={() => onDelete(expense.id)}>Delete</button>
    </div>
  );
}
```

**What Makes a Component:**
- **Function**: Regular JavaScript function
- **Returns JSX**: JavaScript XML (looks like HTML)
- **Takes Props**: Data passed from parent component
- **Reusable**: Can be used multiple times with different data

### **1.3 JSX - JavaScript XML**

**JSX** is a syntax extension that lets you write HTML-like code in JavaScript.

**JSX Rules:**
- Must return a single parent element (or use React Fragment `<>...</>`)
- Use `className` instead of `class`
- Use camelCase for attributes (`onClick`, not `onclick`)
- Embed JavaScript expressions with `{}`

**Example:**
```jsx
function Welcome({ name }) {
  return (
    <div className="welcome">
      <h1>Hello, {name}!</h1>  {/* JavaScript expression in {} */}
      <p>Today is {new Date().toLocaleDateString()}</p>
    </div>
  );
}
```

### **1.4 Props - Passing Data Down**

**Props** (properties) are data passed from parent to child component.

**Key Rules:**
- **Read-Only**: Props cannot be modified by child component
- **Flow Down**: Data flows from parent → child (unidirectional)
- **Immutable**: Props should not be changed

**Example:**
```jsx
// Parent Component
function App() {
  const expense = { id: 1, title: "Groceries", amount: 50.00 };
  
  return (
    <ExpenseItem expense={expense} />  {/* Passing props */}
  );
}

// Child Component
function ExpenseItem({ expense }) {  {/* Receiving props */}
  return <div>{expense.title}</div>;  {/* Using props */}
}
```

**Prop Drilling:**
When data needs to pass through multiple components:
```
App → DashboardPage → ExpenseList → ExpenseItem
     (has data)    (passes)     (passes)   (uses)
```

**Note**: Prop drilling can be verbose, but Context API (advanced) solves this.

### **1.5 State - Component's Own Data**

**State** is data that belongs to a component and can change over time.

**Key Characteristics:**
- **Local to Component**: Each component manages its own state
- **Mutable**: Can be changed (using setter function)
- **Triggers Re-render**: Updating state causes component to re-render

**useState Hook:**
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);  // [state, setter] = useState(initial)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**How useState Works:**
1. `useState(0)` - Initial value is 0
2. Returns array: `[currentValue, setterFunction]`
3. `count` - Current state value
4. `setCount` - Function to update state
5. Calling `setCount(newValue)` updates state and triggers re-render

**Important Rules:**
- **Never mutate state directly**: `count++` ❌ Use `setCount(count + 1)` ✅
- **State updates are asynchronous**: State doesn't update immediately
- **State is isolated**: Each component instance has its own state

### **1.6 useState Patterns**

**Multiple State Variables:**
```jsx
function Form() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  
  // Multiple useState calls for separate pieces of state
}
```

**Object State:**
```jsx
function Form() {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: ''
  });
  
  // Update single property
  setFormData({ ...formData, title: 'New Title' });
  // Spread operator preserves other properties
}
```

**State Initialization with Function:**
```jsx
// Expensive computation - only runs once
const [data, setData] = useState(() => {
  const stored = localStorage.getItem('data');
  return stored ? JSON.parse(stored) : [];
});
```

### **1.7 useEffect - Side Effects Hook**

**useEffect** handles side effects: API calls, subscriptions, DOM manipulation, timers.

**When to Use useEffect:**
- Fetching data from API
- Setting up subscriptions
- Updating document title
- Saving to localStorage
- Cleanup (when component unmounts)

**Basic Syntax:**
```jsx
useEffect(() => {
  // Side effect code
}, [dependencies]);  // Dependency array
```

**Dependency Array:**
- **Empty `[]`**: Run once on mount (component first appears)
- **With values `[expenses]`**: Run when values change
- **No array**: Run on every render (usually avoid)

**Key Rule**: **Cannot make useEffect callback async directly!**

```jsx
// ❌ WRONG - useEffect callback cannot be async
useEffect(async () => {
  const data = await fetchData();
}, []);

// ✅ CORRECT - Define async function inside
useEffect(() => {
  async function fetchData() {
    const data = await fetch('/api/data').then(r => r.json());
    setData(data);
  }
  fetchData();
}, []);
```

### **1.8 useEffect Patterns**

**1. Run Once on Mount (Fetch Data):**
```jsx
useEffect(() => {
  async function loadData() {
    const data = await fetch('/api/expenses').then(r => r.json());
    setExpenses(data);
  }
  loadData();
}, []);  // Empty array = run once
```

**2. Run When Dependency Changes:**
```jsx
useEffect(() => {
  console.log('Expenses changed:', expenses);
}, [expenses]);  // Run when expenses changes
```

**3. Cleanup Function:**
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  // Cleanup function - runs when component unmounts
  return () => {
    clearInterval(timer);
  };
}, []);
```

**4. Save to localStorage:**
```jsx
useEffect(() => {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}, [expenses]);  // Save whenever expenses changes
```

### **1.9 Event Handlers**

**Event Handlers** are functions that respond to user actions (clicks, form submissions, input changes).

**Click Handler:**
```jsx
function Button() {
  const handleClick = () => {
    console.log('Button clicked!');
  };
  
  return <button onClick={handleClick}>Click Me</button>;
}
```

**Form Submission Handler:**
```jsx
function Form() {
  const handleSubmit = (event) => {
    event.preventDefault();  // Prevent page refresh
    // Handle form submission
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Input Change Handler:**
```jsx
function Input() {
  const [value, setValue] = useState('');
  
  const handleChange = (event) => {
    setValue(event.target.value);  // Update state with input value
  };
  
  return <input value={value} onChange={handleChange} />;
}
```

### **1.10 Controlled Components**

**Controlled Components** are form elements whose value is controlled by React state.

**Pattern:**
```jsx
function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <input 
      value={value}                    // Controlled by state
      onChange={(e) => setValue(e.target.value)}  // Update state on change
    />
  );
}
```

**Why Controlled?**
- React controls the input value
- Can read value from state at any time
- Can set value programmatically
- Required for forms in React

---

## 🔍 **PART 2: App.jsx - Complete Breakdown**

Let's break down `App.jsx` line by line:

### **2.1 Imports**

```jsx
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
```

**Breaking It Down:**

**React Hooks:**
- `useState` - State management
- `useEffect` - Side effects (API calls)

**React Router:**
- `Routes`, `Route` - Define routes
- `Link` - Navigation links
- `useNavigate` - Programmatic navigation

**Components:**
- Import custom components from other files
- Default exports: `import ComponentName from './path'`

**Service:**
- `ExpensesService` - API service layer

### **2.2 Component Declaration**

```jsx
function App() {
  const navigate = useNavigate();
```

**Breaking It Down:**

**Function Component:**
- `App` is a function component (React component)
- Returns JSX to render UI

**useNavigate Hook:**
- React Router hook for navigation
- `navigate('/path')` - Programmatically navigate to routes
- Must be used inside `<BrowserRouter>` (wrapped in main.jsx)

### **2.3 State Declarations**

```jsx
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
```

**Breaking It Down:**

**expenses State:**
```jsx
const [expenses, setExpenses] = useState([]);
```
- **Purpose**: Stores list of expenses from API
- **Initial Value**: Empty array `[]`
- **Type**: Array of expense objects
- **Updates**: When fetching from API, adding, deleting expenses

**filteredYear State:**
```jsx
const [filteredYear, setFilteredYear] = useState('2023');
```
- **Purpose**: Stores selected year for filtering
- **Initial Value**: `'2023'` (string)
- **Updates**: When user selects different year from filter

**selectedIds State:**
```jsx
const [selectedIds, setSelectedIds] = useState([]);
```
- **Purpose**: Tracks which expense IDs are selected (for reports)
- **Initial Value**: Empty array `[]`
- **Updates**: When user checks/unchecks expense items

**savedReports State (Lazy Initialization):**
```jsx
const [savedReports, setSavedReports] = useState(() => {
  try {
    const savedReports = localStorage.getItem('savedReports');
    return savedReports ? JSON.parse(savedReports) : [];
  } catch (error) {
    console.warn("failed to retrieve from local storage", error);
    return [];
  }
});
```
- **Purpose**: Stores saved reports from localStorage
- **Initial Value**: Function that reads from localStorage
- **Why Function?**: Only runs once (expensive operation)
- **Try-Catch**: Handles JSON parse errors
- **Returns**: Parsed data or empty array

**isLoading State:**
```jsx
const [isLoading, setIsLoading] = useState(false);
```
- **Purpose**: Tracks if API call is in progress
- **Initial Value**: `false`
- **Updates**: Set to `true` before API call, `false` after
- **Use**: Show loading spinner/message

**error State:**
```jsx
const [error, setError] = useState(null);
```
- **Purpose**: Stores error messages
- **Initial Value**: `null` (no error)
- **Updates**: Set error message when API call fails
- **Use**: Display error message to user

### **2.4 useEffect - Save to localStorage**

```jsx
useEffect(() => {
  localStorage.setItem('savedReports', JSON.stringify(savedReports));
}, [savedReports]);
```

**Breaking It Down:**

**Purpose:**
- Saves `savedReports` to localStorage whenever it changes
- Persists data between page refreshes

**How It Works:**
1. **Trigger**: Runs when `savedReports` changes (dependency array)
2. **Action**: Converts array to JSON string, saves to localStorage
3. **JSON.stringify**: Converts JavaScript object/array to JSON string
4. **localStorage.setItem**: Saves to browser's local storage

**Dependency Array `[savedReports]`:**
- Runs whenever `savedReports` state changes
- Ensures localStorage is always in sync with state

**Flow:**
```
User saves report → setSavedReports([...reports, newReport])
  ↓
savedReports state updates
  ↓
useEffect detects change (dependency array)
  ↓
Saves to localStorage
```

### **2.5 useEffect - Fetch Data on Mount**

```jsx
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
    } finally {
      setIsLoading(false);
    }
  }
  fetchExpenses();
}, []);
```

**Breaking It Down Line by Line:**

**Step 1: useEffect Setup**
```jsx
useEffect(() => {
  // ...
}, []);
```
- **Empty dependency array `[]`**: Runs once when component mounts (first render)
- **Purpose**: Fetch expenses when app first loads

**Step 2: Define Async Function**
```jsx
async function fetchExpenses() {
  // ...
}
```
- **Why async function inside?**: useEffect callback cannot be async directly
- **Define inside, call immediately**: Standard pattern for async in useEffect

**Step 3: Set Loading State**
```jsx
setIsLoading(true);
setError(null);
```
- **setIsLoading(true)**: Show loading indicator
- **setError(null)**: Clear any previous errors

**Step 4: Try Block - Fetch Data**
```jsx
try {
  const data = await ExpensesService.getAll();
```
- **await**: Wait for API call to complete
- **ExpensesService.getAll()**: Calls service method (we'll see this next)
- **Returns**: Promise that resolves to array of expenses

**Step 5: Transform Data**
```jsx
const transformedData = data.map(item => ({
  ...item,
  date: new Date(item.date)
}));
```
- **Problem**: API returns date as string, but code expects Date object
- **Solution**: Map over data, convert date string to Date object
- **Spread operator `...item`**: Copy all properties
- **Date conversion**: `new Date(item.date)` converts string to Date

**Step 6: Update State**
```jsx
setExpenses(transformedData);
```
- **setExpenses**: Updates expenses state with fetched data
- **Triggers re-render**: Component re-renders with new data

**Step 7: Error Handling**
```jsx
catch (error) {
  console.warn("Failed to retrieve from server!", error);
  setError(error.message);
}
```
- **Catches**: Any errors from API call
- **setError**: Stores error message in state
- **User sees**: Error message displayed in UI

**Step 8: Finally Block**
```jsx
finally {
  setIsLoading(false);
}
```
- **Always runs**: Whether success or error
- **setIsLoading(false)**: Hide loading indicator
- **Ensures**: Loading state always reset

**Complete Flow:**
```
Component mounts
  ↓
useEffect runs (empty dependency array)
  ↓
setIsLoading(true) - Show loading
  ↓
Call ExpensesService.getAll()
  ↓
Wait for response (await)
  ↓
Transform data (convert dates)
  ↓
setExpenses(data) - Update state
  ↓
Component re-renders with new data
  ↓
setIsLoading(false) - Hide loading
```

### **2.6 deleteExpenseHandler - Async Handler**

```jsx
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
```

**Breaking It Down:**

**Function Signature:**
```jsx
const deleteExpenseHandler = async (id) => {
```
- **async**: Function is asynchronous (can use await)
- **Parameter**: `id` - ID of expense to delete
- **Event Handler**: Called when user clicks delete button

**Set Loading State:**
```jsx
setIsLoading(true);
setError(null);
```
- Shows loading indicator
- Clears previous errors

**Try Block - Delete Expense:**
```jsx
try {
  ExpensesService.deleteExpense(id);
```
- **Calls service**: Delete expense from backend
- **Note**: This example doesn't use `await`, but should for error handling

**Optimistic Update:**
```jsx
setExpenses((prevExpenses) => prevExpenses.filter(expense => expense.id !== id));
```
- **Immediate UI update**: Removes expense from list before API confirms
- **Functional update**: `prevExpenses => ...` uses previous state
- **filter**: Removes expense with matching ID
- **Why functional?**: Ensures we use latest state

**Error Handling:**
```jsx
catch (error) {
  setError(error.message);
  console.warn("Failed to delete from server!", error);
}
```
- Catches API errors
- Shows error to user

**Finally Block:**
```jsx
finally {
  setIsLoading(false);
}
```
- Always hide loading indicator

**Flow:**
```
User clicks delete button
  ↓
deleteExpenseHandler(id) called
  ↓
setIsLoading(true)
  ↓
Call API to delete
  ↓
Optimistically update UI (remove from list)
  ↓
setIsLoading(false)
```

### **2.7 addExpenseHandler - Async Handler**

```jsx
const addExpenseHandler = async (expense) => {
  setIsLoading(true);
  setError(null);

  try {
    const newExpenseData = await ExpensesService.postExpense(expense);
    const expenseWithDate = { ...newExpenseData, date: new Date(newExpenseData.date) };
    setExpenses((prev) => [expenseWithDate, ...prev]);
  } catch (error) {
    setError('Failed to save expense! ' + error.message);
  } finally {
    setIsLoading(false);
  }
};
```

**Breaking It Down:**

**Function Signature:**
```jsx
const addExpenseHandler = async (expense) => {
```
- **async**: Can use await
- **Parameter**: `expense` - New expense object (from form)

**Set Loading State:**
```jsx
setIsLoading(true);
setError(null);
```

**Try Block - Create Expense:**
```jsx
const newExpenseData = await ExpensesService.postExpense(expense);
```
- **await**: Wait for API call
- **postExpense**: POST request to create expense
- **Returns**: New expense object (with ID from server)

**Transform Date:**
```jsx
const expenseWithDate = { ...newExpenseData, date: new Date(newExpenseData.date) };
```
- **Spread operator**: Copy all properties from API response
- **Date conversion**: Convert date string to Date object
- **Why?**: API returns date as string, code expects Date object

**Update State (Add to Beginning):**
```jsx
setExpenses((prev) => [expenseWithDate, ...prev]);
```
- **Functional update**: Uses previous state
- **Array spread**: `[newItem, ...oldItems]` - Add to beginning
- **Why beginning?**: Show newest expenses first

**Error Handling:**
```jsx
catch (error) {
  setError('Failed to save expense! ' + error.message);
}
```

**Flow:**
```
User submits form
  ↓
addExpenseHandler(expenseData) called
  ↓
setIsLoading(true)
  ↓
POST to API (create expense)
  ↓
Receive new expense with ID
  ↓
Convert date string to Date object
  ↓
Add to beginning of expenses list
  ↓
Component re-renders with new expense
  ↓
setIsLoading(false)
```

### **2.8 Other Handlers**

```jsx
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
  setSavedReports(prevReports => [...prevReports, report]);
  setSelectedIds([]);
};
```

**filterChangeHandler:**
- Updates filtered year state
- Simple state update

**toggleExpenseHandler:**
- Toggles expense ID in selectedIds array
- If selected, remove it
- If not selected, add it
- Functional update for array manipulation

**saveReportHandler:**
- Adds new report to savedReports
- Clears selectedIds (reset checkboxes)

### **2.9 Computed Values**

```jsx
const filteredExpenses = expenses.filter((expense) => {
  return expense.date.getFullYear().toString() === filteredYear;
});

const reportExpenses = expenses.filter((expense) => {
  return selectedIds.includes(expense.id);
});
```

**filteredExpenses:**
- Filters expenses by selected year
- Gets year from date, compares to filteredYear
- Used for display

**reportExpenses:**
- Filters expenses that are selected
- Checks if expense.id is in selectedIds array
- Used for report generation

**Note**: These are computed on every render, not stored in state.

### **2.10 Return (JSX)**

```jsx
return (
  <div>
    <Navigation />
    
    <Routes>
      <Route path="/dashboard" element={<ExpensesDashboard />} />
      <Route path="/reports" element={<SavedReportsPage savedReports={savedReports} deleteReportHandler={deleteReportHandler} />} />
      <Route path="/" element={<div><Link to="/dashboard">Go To Dashboard</Link></div>} />
    </Routes>
  </div>
);
```

**Breaking It Down:**

**Navigation Component:**
- Renders navigation menu
- Available on all routes

**Routes:**
- React Router routes
- Different paths render different components
- Props passed to components

**Route Props:**
- `path`: URL path
- `element`: Component to render

---

## 🔧 **PART 3: ExpensesService.jsx - Complete Breakdown**

Let's break down the service layer:

```jsx
const ExpensesService = {
  baseUrl: "http://localhost:3000/expenses",

  async getAll() {
    console.log(this.baseUrl);
    const response = await fetch(this.baseUrl);
    console.log(response);
    if (!response.ok) throw new Error('Failed to fetch!');
    return response.json();
  },
  
  async postExpense(expense) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    if(!response.ok) throw new Error('Failed to save expense!');
    return response.json();
  },
  
  async deleteExpense(id) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    });
    if(!response.ok) throw new Error('Failed to delete expense!');
    return response.json();
  }
};

export default ExpensesService;
```

### **3.1 Service Object Structure**

```jsx
const ExpensesService = {
  baseUrl: "http://localhost:3000/expenses",
  // Methods...
};
```

**Breaking It Down:**

**Object Literal:**
- Service is an object, not a class
- Contains methods for API calls
- Centralizes API logic

**baseUrl Property:**
- Base URL for all API calls
- Single source of truth
- Easy to change if API location changes

**Why Object vs Class?**
- Simpler for stateless services
- No need for instances
- Just a collection of related functions

### **3.2 getAll() - GET Request**

```jsx
async getAll() {
  console.log(this.baseUrl);
  const response = await fetch(this.baseUrl);
  console.log(response);
  if (!response.ok) throw new Error('Failed to fetch!');
  return response.json();
}
```

**Breaking It Down:**

**Method Signature:**
```jsx
async getAll() {
```
- **async**: Can use await
- **No parameters**: Gets all expenses
- **Returns**: Promise that resolves to array of expenses

**Fetch API:**
```jsx
const response = await fetch(this.baseUrl);
```
- **fetch()**: Built-in browser API for HTTP requests
- **this.baseUrl**: Uses baseUrl from service object
- **await**: Waits for response
- **Returns**: Response object (not JSON yet)

**Response Object:**
- Contains status, headers, body
- Has `ok` property: true if status 200-299
- Has `json()` method: Converts body to JSON

**Error Checking:**
```jsx
if (!response.ok) throw new Error('Failed to fetch!');
```
- **response.ok**: Checks if status is 200-299
- **If not ok**: Throws error (caught by try-catch in component)
- **Why?**: fetch() doesn't throw on HTTP errors, need to check manually

**Parse JSON:**
```jsx
return response.json();
```
- **response.json()**: Converts response body to JavaScript object
- **Returns**: Promise that resolves to parsed JSON
- **Type**: Array of expense objects

**Complete Flow:**
```
Component calls ExpensesService.getAll()
  ↓
fetch('http://localhost:3000/expenses')
  ↓
HTTP GET request sent
  ↓
Wait for response (await)
  ↓
Check if response.ok
  ↓
Parse JSON (response.json())
  ↓
Return array of expenses
  ↓
Component receives data
```

### **3.3 postExpense() - POST Request**

```jsx
async postExpense(expense) {
  const response = await fetch(this.baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense)
  });
  if(!response.ok) throw new Error('Failed to save expense!');
  return response.json();
}
```

**Breaking It Down:**

**Method Signature:**
```jsx
async postExpense(expense) {
```
- **Parameter**: `expense` - Expense object to create
- **Returns**: Promise that resolves to created expense (with ID)

**Fetch with Options:**
```jsx
const response = await fetch(this.baseUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(expense)
});
```

**Options Object:**
- **method: 'POST'**: HTTP method (default is GET)
- **headers**: HTTP headers
  - `'Content-Type': 'application/json'` - Tells server we're sending JSON
- **body**: Request body (data to send)
  - `JSON.stringify(expense)` - Converts JavaScript object to JSON string

**JSON.stringify:**
- Converts JavaScript object to JSON string
- Example: `{title: "Food", amount: 50}` → `'{"title":"Food","amount":50}'`

**Error Checking:**
```jsx
if(!response.ok) throw new Error('Failed to save expense!');
```

**Return:**
```jsx
return response.json();
```
- Returns created expense object (with ID from server)

**Complete Flow:**
```
Component calls ExpensesService.postExpense(expenseData)
  ↓
Convert expenseData to JSON string
  ↓
POST request with JSON body
  ↓
Wait for response
  ↓
Check if response.ok
  ↓
Parse JSON response
  ↓
Return created expense (with ID)
  ↓
Component receives new expense
```

### **3.4 deleteExpense() - DELETE Request**

```jsx
async deleteExpense(id) {
  const response = await fetch(`${this.baseUrl}/${id}`, {
    method: 'DELETE'
  });
  if(!response.ok) throw new Error('Failed to delete expense!');
  return response.json();
}
```

**Breaking It Down:**

**Method Signature:**
```jsx
async deleteExpense(id) {
```
- **Parameter**: `id` - ID of expense to delete
- **Returns**: Promise (may return nothing or confirmation)

**URL with ID:**
```jsx
const response = await fetch(`${this.baseUrl}/${id}`, {
```
- **Template literal**: `${this.baseUrl}/${id}`
- **Example**: `http://localhost:3000/expenses/123`
- **ID in URL**: Standard REST pattern

**Options:**
```jsx
method: 'DELETE'
```
- **method: 'DELETE'**: HTTP DELETE method
- **No body needed**: DELETE usually doesn't need body

**Error Checking:**
```jsx
if(!response.ok) throw new Error('Failed to delete expense!');
```

**Return:**
```jsx
return response.json();
```
- May return confirmation or empty response

### **3.5 Export**

```jsx
export default ExpensesService;
```

**Breaking It Down:**
- **Default export**: Allows importing as `import ExpensesService from './services/ExpensesService'`
- **Named export alternative**: `export { ExpensesService }` (requires `import { ExpensesService }`)

---

## 📝 **PART 4: ExpenseForm.jsx - Complete Breakdown**

Let's break down the form component:

```jsx
import { useState } from "react";

const ExpenseForm = (prop) => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  const [enteredDate, setEnteredDate] = useState('');

  const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
  }

  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);
  }

  const dateChangeHandler = (event) => {
    setEnteredDate(event.target.value);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    const expenseData = {
      title: enteredTitle,
      amount: enteredAmount,
      date: new Date(`${enteredDate}T00:00:00`)
    };
    prop.onSaveExpenseData(expenseData);
  }

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        value={enteredTitle}
        onChange={titleChangeHandler}
        placeholder="e.g. Fuel"
        required
      />
      <input
        type="number"
        value={enteredAmount}
        onChange={amountChangeHandler}
        placeholder="0.00"
        required
      />
      <input
        type="date"
        value={enteredDate}
        onChange={dateChangeHandler}
        required
      />
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
```

### **4.1 Component Declaration**

```jsx
const ExpenseForm = (prop) => {
```

**Breaking It Down:**
- **Function component**: Receives props
- **prop parameter**: All props (could destructure: `({ onSaveExpenseData })`)
- **Better practice**: `const ExpenseForm = ({ onSaveExpenseData }) => {`

### **4.2 State for Form Fields**

```jsx
const [enteredTitle, setEnteredTitle] = useState('');
const [enteredAmount, setEnteredAmount] = useState('');
const [enteredDate, setEnteredDate] = useState('');
```

**Breaking It Down:**
- **Three separate state variables**: One for each input
- **Initial values**: Empty strings (controlled inputs start empty)
- **Alternative**: Could use object state:
  ```jsx
  const [formData, setFormData] = useState({ title: '', amount: '', date: '' });
  ```

### **4.3 Change Handlers**

```jsx
const titleChangeHandler = (event) => {
  setEnteredTitle(event.target.value);
}
```

**Breaking It Down:**
- **Event parameter**: Browser event object
- **event.target**: The input element that triggered event
- **event.target.value**: Current value of input
- **setEnteredTitle**: Updates state with new value
- **Result**: Input is controlled (React controls value)

**Pattern:**
- Each input has its own change handler
- Handler updates corresponding state
- Same pattern for all inputs

### **4.4 Submit Handler**

```jsx
const submitHandler = (event) => {
  event.preventDefault();
  const expenseData = {
    title: enteredTitle,
    amount: enteredAmount,
    date: new Date(`${enteredDate}T00:00:00`)
  };
  prop.onSaveExpenseData(expenseData);
}
```

**Breaking It Down:**

**event.preventDefault():**
- Prevents default form submission (page refresh)
- **Critical**: Without this, form submits and page refreshes
- **Why?**: We handle submission with JavaScript, not HTML form submit

**Create Expense Data Object:**
```jsx
const expenseData = {
  title: enteredTitle,
  amount: enteredAmount,
  date: new Date(`${enteredDate}T00:00:00`)
};
```
- **Combines**: All form field values into object
- **Date conversion**: Converts date string to Date object
- **Why `T00:00:00`?**: Date input returns `YYYY-MM-DD`, adding time makes it valid Date

**Call Parent Handler:**
```jsx
prop.onSaveExpenseData(expenseData);
```
- **Lifts state up**: Sends data to parent component
- **Parent handles**: API call and state update
- **Pattern**: Child collects data, parent processes it

### **4.5 Controlled Inputs**

```jsx
<input
  type="text"
  value={enteredTitle}
  onChange={titleChangeHandler}
  placeholder="e.g. Fuel"
  required
/>
```

**Breaking It Down:**

**value={enteredTitle}:**
- **Controlled**: Input value comes from state
- **React controls**: Input value is always `enteredTitle` state
- **Single source of truth**: State is source of truth

**onChange={titleChangeHandler}:**
- **Event handler**: Called when user types
- **Updates state**: State update triggers re-render
- **Re-render**: Input shows new value

**Controlled Component Pattern:**
```
User types → onChange fires → Update state → Component re-renders → Input shows new value
```

**Why Controlled?**
- React controls the input
- Can read value from state
- Can set value programmatically
- Required for React forms

### **4.6 Form Element**

```jsx
<form onSubmit={submitHandler}>
  {/* inputs */}
  <button type="submit">Add Expense</button>
</form>
```

**Breaking It Down:**
- **onSubmit**: Called when form is submitted (button click or Enter key)
- **type="submit"**: Button submits form
- **Required inputs**: HTML5 validation before submit

---

## 🔄 **PART 5: Complete Data Flow**

### **5.1 Adding an Expense - Complete Flow**

Let's trace the complete flow from user action to database:

```
1. USER ACTION
   User fills form and clicks "Add Expense" button
   ↓
2. EXPENSEFORM COMPONENT
   submitHandler(event) called
   - event.preventDefault() - Prevents page refresh
   - Creates expenseData object from form fields
   - Calls prop.onSaveExpenseData(expenseData)
   ↓
3. APP.JSX
   addExpenseHandler(expense) called
   - setIsLoading(true) - Show loading
   - setError(null) - Clear errors
   ↓
4. EXPENSES SERVICE
   ExpensesService.postExpense(expense) called
   - Converts expense to JSON string
   - Sends POST request to http://localhost:3000/expenses
   ↓
5. HTTP REQUEST
   POST /api/expenses
   Headers: Content-Type: application/json
   Body: {"title":"Food","amount":50,"date":"2024-01-15"}
   ↓
6. SPRING BOOT BACKEND
   ExpenseController.create(@RequestBody ExpenseDTO dto)
   - Receives JSON, converts to ExpenseDTO
   - Calls ExpenseService.create(dto)
   ↓
7. EXPENSE SERVICE (BACKEND)
   ExpenseService.create(ExpenseWOIDDTO dto)
   - Creates Expense entity
   - Calls ExpenseRepository.save(entity)
   ↓
8. DATABASE
   INSERT INTO expenses (title, amount, date) VALUES (...)
   - Database generates ID
   - Saves expense
   ↓
9. RESPONSE FLOW BACK
   Database → Repository → Service → Controller
   - Returns ExpenseDTO with generated ID
   - Converts to JSON
   ↓
10. HTTP RESPONSE
    Status: 201 Created
    Body: {"id":"123","title":"Food","amount":50,"date":"2024-01-15"}
    ↓
11. EXPENSES SERVICE (FRONTEND)
    ExpensesService.postExpense() receives response
    - Parses JSON to JavaScript object
    - Returns expense object (with ID)
    ↓
12. APP.JSX (CONTINUED)
    addExpenseHandler receives newExpenseData
    - Converts date string to Date object
    - setExpenses([newExpense, ...prevExpenses])
    - setIsLoading(false)
    ↓
13. REACT RE-RENDER
    Component re-renders with new expense in state
    - ExpenseList shows new expense
    - Loading indicator disappears
    ↓
14. USER SEES RESULT
    New expense appears in the list
    Form is cleared (if implemented)
```

### **5.2 Fetching Expenses on Mount - Complete Flow**

```
1. APP MOUNTS
   App component first renders
   ↓
2. useEffect RUNS
   useEffect(() => { fetchExpenses(); }, [])
   - Empty dependency array = runs once on mount
   ↓
3. ASYNC FUNCTION
   async function fetchExpenses() {
     setIsLoading(true)
     - Shows loading indicator
   ↓
4. API CALL
   ExpensesService.getAll()
   - Sends GET request to http://localhost:3000/expenses
   ↓
5. SPRING BOOT BACKEND
   ExpenseController.getAll()
   - Calls ExpenseService.getAll()
   - Returns List<ExpenseDTO>
   - Converts to JSON array
   ↓
6. HTTP RESPONSE
   Status: 200 OK
   Body: [{"id":"1","title":"Food",...}, {"id":"2",...}]
   ↓
7. PARSE JSON
   response.json() converts JSON to JavaScript array
   ↓
8. TRANSFORM DATA
   data.map(item => ({ ...item, date: new Date(item.date) }))
   - Converts date strings to Date objects
   ↓
9. UPDATE STATE
   setExpenses(transformedData)
   - Updates expenses state
   ↓
10. RE-RENDER
    Component re-renders with expenses data
    - ExpenseList displays expenses
    - setIsLoading(false)
    - Loading indicator disappears
```

---

## 🎯 **KEY TAKEAWAYS FOR INTERVIEW**

### **React Concepts:**

1. **Components**: Reusable UI pieces, functional components
2. **Props**: Data passed from parent to child (read-only, flows down)
3. **State**: Component's own data (mutable, triggers re-render)
4. **useState**: Hook for managing state
5. **useEffect**: Hook for side effects (API calls, subscriptions)
6. **Event Handlers**: Functions that respond to user actions
7. **Controlled Components**: Form inputs controlled by React state

### **API Integration:**

1. **fetch()**: Browser API for HTTP requests
2. **async/await**: Handle asynchronous operations
3. **Service Layer**: Centralizes API calls
4. **Error Handling**: try-catch for API errors
5. **Loading States**: Track API call status
6. **Data Transformation**: Convert API responses to component format

### **Data Flow:**

1. **Unidirectional**: Data flows down (props), events flow up (callbacks)
2. **State Lifting**: Shared state lifted to common parent
3. **Prop Drilling**: Passing data through multiple components
4. **Service Pattern**: Separate API logic from components

---

## ✅ **PRACTICE EXERCISES**

1. **Trace the flow** for deleting an expense:
   - Which component handles the click?
   - Which handler is called?
   - What API method is used?
   - How is state updated?

2. **Explain useState**: 
   - What happens when you call `setState(newValue)`?
   - Why use functional updates `setState(prev => ...)`?
   - What triggers a re-render?

3. **Explain useEffect**:
   - What does empty dependency array `[]` mean?
   - Why can't useEffect callback be async directly?
   - When would you use dependencies?

4. **Explain Controlled Components**:
   - What makes an input "controlled"?
   - Why use controlled components?
   - What's the pattern: value + onChange?

5. **Explain fetch()**:
   - What does fetch() return?
   - Why check `response.ok`?
   - What does `response.json()` do?

---

**Congratulations! You've completed Phase 3. You now understand:**
- ✅ How React components work
- ✅ How useState manages state
- ✅ How useEffect handles side effects
- ✅ How to make API calls with fetch()
- ✅ How forms work in React
- ✅ How data flows through the application

**Next Steps**: Move to Phase 4 to understand how frontend and backend connect!
