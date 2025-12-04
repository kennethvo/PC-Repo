# React Code Guide: Understanding Your Expense Tracker

This guide explains how React works in your expense tracker application, covering key concepts, terminology, and syntax. We'll focus on React fundamentals, routing, and data persistence.

---

## Table of Contents

1. [What is React?](#what-is-react)
2. [Project Structure](#project-structure)
3. [Basic React Concepts](#basic-react-concepts)
4. [Components and JSX](#components-and-jsx)
5. [State Management with Hooks](#state-management-with-hooks)
6. [Props: Passing Data Between Components](#props-passing-data-between-components)
7. [Routing with React Router](#routing-with-react-router)
8. [Data Persistence](#data-persistence)
9. [Event Handling](#event-handling)
10. [Conditional Rendering](#conditional-rendering)
11. [Lists and Keys](#lists-and-keys)
12. [Key Terminology Reference](#key-terminology-reference)

---

## What is React?

React is a **JavaScript library** for building user interfaces (UIs). It allows you to create interactive web applications by breaking the UI into reusable pieces called **components**.

### Key Characteristics:
- **Component-Based**: UI is built from small, reusable components
- **Declarative**: You describe what the UI should look like, React handles how to update it
- **Reactive**: When data changes, React automatically updates the parts of the UI that need to change

---

## Project Structure

Your expense tracker is organized as follows:

```
src/
├── main.jsx              # Entry point - where React starts
├── App.jsx               # Main application component
├── components/           # Reusable UI components
│   ├── ExpenseForm.jsx
│   ├── Expenses/
│   │   ├── ExpenseList.jsx
│   │   ├── ExpenseItem.jsx
│   │   ├── ExpenseFilter.jsx
│   │   └── ExpenseDate.jsx
│   ├── pages/
│   │   ├── Navigation.jsx
│   │   ├── ExpensesDashboard.jsx
│   │   └── SavedReportsPage.jsx
│   ├── ReportSummary.jsx
│   └── SavedReportsList.jsx
└── services/
    └── ExpensesService.jsx   # API communication layer
```

---

## Basic React Concepts

### JSX: JavaScript XML

JSX is a syntax extension that lets you write HTML-like code inside JavaScript. React converts JSX into JavaScript.

**Example from `ExpenseItem.jsx`:**
```jsx
return (
    <div className="flex items-center">
        <h1>{title}</h1>
        <h2>{amount}</h2>
    </div>
);
```

**Key Points:**
- JSX looks like HTML but is actually JavaScript
- Use `className` instead of `class` (since `class` is a reserved word in JavaScript)
- Use curly braces `{}` to embed JavaScript expressions: `{title}`, `{amount}`
- JSX must return a single parent element (or use fragments: `<></>`)

### Components

Components are the building blocks of React applications. They are **functions** that return JSX.

**Example from `ExpenseItem.jsx`:**
```jsx
const ExpenseItem = ({ id, title, amount, date, isSelected, onToggle, onDelete }) => {
    return (
        <div>
            <h1>{title}</h1>
            <h2>{amount}</h2>
        </div>
    );
};

export default ExpenseItem;
```

**Component Rules:**
- Must start with a capital letter (React uses this to distinguish components from HTML elements)
- Must return JSX (or `null`)
- Should be exported so other files can use them: `export default ComponentName`

---

## State Management with Hooks

### What is State?

**State** represents data that can change over time in your component. When state changes, React automatically re-renders the component to reflect those changes.

### useState Hook

The `useState` hook is used to create and manage state in functional components.

**Syntax:**
```jsx
const [stateVariable, setStateFunction] = useState(initialValue);
```

**Example from `App.jsx`:**
```jsx
const [expenses, setExpenses] = useState([]);
const [filteredYear, setFilteredYear] = useState('2023');
const [selectedIds, setSelectedIds] = useState([]);
```

**Breaking it down:**
- `expenses` - the current value of the state
- `setExpenses` - function to update the state
- `useState([])` - initial value (empty array in this case)

**Updating State:**

You **must** use the setter function - never modify state directly:

```jsx
// ✅ CORRECT - Using the setter function
setExpenses([...expenses, newExpense]);

// ❌ WRONG - Don't modify directly
expenses.push(newExpense); // This won't trigger a re-render!
```

**Using Previous State:**

When updating state based on its previous value, use a function:

```jsx
// From App.jsx
setExpenses((prevExpenses) => prevExpenses.filter(expense => expense.id !== id));

setSelectedIds((prevSelected) => {
    if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
    } else {
        return [...prevSelected, id];
    }
});
```

**Why?** This ensures you're always working with the most current state, especially important when multiple updates might happen.

### useState with Initializer Function

Sometimes you want to compute the initial state. Use a function for this:

```jsx
// From App.jsx - Loading from localStorage
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

The function runs **only once** when the component first mounts, not on every render.

---

## Props: Passing Data Between Components

**Props** (short for "properties") are how you pass data from a parent component to a child component. Props are **read-only** - child components cannot modify them.

### Passing Props Down

**Parent component (`App.jsx`):**
```jsx
<SavedReportsPage 
    savedReports={savedReports}
    deleteReportHandler={deleteReportHandler}
/>
```

**Receiving Props in Child Component:**

There are two ways to receive props:

**Method 1: Destructured (Recommended)**
```jsx
// From ExpenseList.jsx
const ExpenseList = ({ items, selectedIds, onToggleItem, onDeleteItem }) => {
    // Use items, selectedIds, etc. directly
};
```

**Method 2: Props Object**
```jsx
// From ExpenseForm.jsx
const ExpenseForm = (prop) => {
    // Access via prop.onSaveExpenseData
    prop.onSaveExpenseData(expenseData);
};
```

### Passing Functions as Props

Functions can be passed as props to allow child components to communicate with parents:

```jsx
// Parent: App.jsx
const deleteExpenseHandler = async (id) => {
    setExpenses((prevExpenses) => prevExpenses.filter(expense => expense.id !== id));
};

// Pass function to child
<ExpenseList onDeleteItem={deleteExpenseHandler} />

// Child: ExpenseItem.jsx receives and calls it
<button onClick={() => onDelete(id)}>X</button>
```

**This is called "lifting state up"** - the parent manages the state, children call functions to request updates.

---

## Routing with React Router

React Router enables **client-side routing** - navigation between different "pages" in your single-page application (SPA) without full page reloads.

### Setting Up the Router

**In `main.jsx`:**
```jsx
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)
```

`BrowserRouter` wraps your entire app and provides routing functionality to all child components.

### Defining Routes

**In `App.jsx`:**
```jsx
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

<Routes>
    <Route 
        path="/dashboard"
        element={<ExpensesDashboard />}
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
                <Link to="/dashboard">Go To Dashboard</Link>
            </div>
        }
    />
</Routes>
```

**Key Concepts:**
- `<Routes>` - Container for all route definitions
- `<Route>` - Defines a URL path and what component to render
- `path` - The URL path (e.g., `/dashboard`, `/reports`)
- `element` - The component (or JSX) to render when path matches

### Navigation

**Using `<Link>` Component:**

`Link` creates clickable navigation links that don't cause full page reloads:

```jsx
// From Navigation.jsx
import { Link } from 'react-router-dom';

<Link to="/dashboard">Expenses</Link>
<Link to="/reports">Reports</Link>
```

**Using `useNavigate` Hook:**

For programmatic navigation (e.g., after form submission):

```jsx
// From App.jsx
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();
    
    // Navigate programmatically
    // navigate('/dashboard');
}
```

### Route Parameters and Props

You can pass data to route components through props:

```jsx
<Route 
    path="/reports"
    element={<SavedReportsPage 
        savedReports={savedReports}
        deleteReportHandler={deleteReportHandler}
    />}
/>
```

The component receives these as props just like any other component.

---

## Data Persistence

Your application uses two methods to persist data:

### 1. LocalStorage (Browser Storage)

**LocalStorage** stores data in the user's browser that persists between sessions.

**Saving to LocalStorage:**

```jsx
// From App.jsx - Saving savedReports whenever they change
useEffect(() => {
    localStorage.setItem('savedReports', JSON.stringify(savedReports));
}, [savedReports]);
```

**Loading from LocalStorage:**

```jsx
// Initialize state from localStorage
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

**Important Notes:**
- LocalStorage only stores **strings** - use `JSON.stringify()` to save objects/arrays
- Use `JSON.parse()` to convert back to JavaScript objects
- Always wrap in try-catch for error handling
- Data persists even after browser closes

### 2. API/Fetch (Server Persistence)

**The `ExpensesService.jsx` file handles API communication:**

```jsx
const ExpensesService = {
    baseUrl: "http://localhost:3000/expenses",

    async getAll() {
        const response = await fetch(this.baseUrl);
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
```

**Using the Service in Components:**

```jsx
// From App.jsx
const addExpenseHandler = async (expense) => {
    setIsLoading(true);
    setError(null);

    try {
        const newExpenseData = await ExpensesService.postExpense(expense);
        const expenseWithDate = { 
            ...newExpenseData, 
            date: new Date(newExpenseData.date) 
        };
        setExpenses((prev) => [expenseWithDate, ...prev]);
    } catch (error) {
        setError('Failed to save expense! ' + error.message);
    } finally {
        setIsLoading(false);
    }
};
```

**Key Concepts:**
- **async/await**: Handles asynchronous operations (API calls take time)
- **try/catch/finally**: Error handling structure
- **fetch API**: Browser's built-in method for HTTP requests
- **RESTful operations**: GET (read), POST (create), DELETE (remove)

---

## Event Handling

React uses **synthetic events** - wrappers around native browser events.

### Common Event Patterns

**Form Submission:**
```jsx
// From ExpenseForm.jsx
const submitHandler = (event) => {
    event.preventDefault(); // Prevents page refresh
    // Handle form data
    prop.onSaveExpenseData(expenseData);
};

<form onSubmit={submitHandler}>
    {/* form fields */}
</form>
```

**Input Changes:**
```jsx
// From ExpenseForm.jsx
const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
};

<input
    type="text"
    value={enteredTitle}
    onChange={titleChangeHandler}
/>
```

**Button Clicks:**
```jsx
// From ExpenseItem.jsx
<button onClick={() => onDelete(id)}>X</button>
```

**Key Points:**
- Use `onClick`, `onChange`, `onSubmit` (camelCase, not lowercase)
- Event handlers receive an `event` object
- Access values via `event.target.value` (for inputs) or `event.target.checked` (for checkboxes)
- Use arrow functions `() =>` when you need to pass parameters

---

## Conditional Rendering

Conditionally show/hide UI elements based on state or props.

**Example from `ExpenseList.jsx`:**
```jsx
if (items.length === 0) {
    return <h2>No expenses found.</h2>;
}

return (
    <div>
        {items.map((expense) => (
            <ExpenseItem key={expense.id} {...expense} />
        ))}
    </div>
);
```

**Example from `SavedReportsList.jsx`:**
```jsx
if (reports.length === 0) {
    return null; // Render nothing
}

return (
    <div>
        {/* render reports */}
    </div>
);
```

**Other Conditional Patterns:**
```jsx
// Ternary operator
{isLoading ? <div>Loading...</div> : <div>Content</div>}

// Logical AND
{error && <div>Error: {error}</div>}
```

---

## Lists and Keys

When rendering lists, React needs a way to track each item. Use the `key` prop.

**Example from `ExpenseList.jsx`:**
```jsx
{items.map((expense) => (
    <ExpenseItem 
        key={expense.id}  // ← REQUIRED: unique identifier
        id={expense.id}
        title={expense.title}
        amount={expense.amount}
        date={expense.date}
        isSelected={selectedIds.includes(expense.id)}
        onToggle={onToggleItem}
        onDelete={onDeleteItem}
    />
))}
```

**Key Rules:**
- Every item in a list must have a unique `key` prop
- Keys should be stable (don't use array index if items can be reordered)
- Keys help React efficiently update the DOM when list changes
- Keys are for React's internal use (not accessible as props in the component)

---

## useEffect Hook

The `useEffect` hook lets you perform **side effects** - operations that happen outside the normal render flow (like API calls, subscriptions, or DOM manipulation).

### Basic Syntax

```jsx
useEffect(() => {
    // Side effect code here
}, [dependencies]); // Dependency array
```

### Examples from Your Code

**1. Saving to LocalStorage (runs when `savedReports` changes):**
```jsx
useEffect(() => {
    localStorage.setItem('savedReports', JSON.stringify(savedReports));
}, [savedReports]); // Runs whenever savedReports changes
```

**2. Fetching Data on Component Mount (runs once):**
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
}, []); // Empty array = runs only once on mount
```

### Dependency Array Explained

- **`[]`** (empty) - Runs once when component mounts (and on unmount if cleanup function exists)
- **`[value]`** - Runs whenever `value` changes
- **No array** - Runs after **every** render (use carefully!)

### Cleanup Functions

For effects that need cleanup (like timers, subscriptions):

```jsx
useEffect(() => {
    const timer = setInterval(() => {
        // Do something
    }, 1000);

    return () => {
        clearInterval(timer); // Cleanup
    };
}, []);
```

---

## Key Terminology Reference

### Component
A reusable piece of UI. Functions that return JSX.

### JSX
JavaScript XML - HTML-like syntax used in React components.

### Props
Data passed from parent to child components. Always read-only.

### State
Data that can change in a component. Managed with `useState`.

### Hook
Functions that let you "hook into" React features (e.g., `useState`, `useEffect`).

### Re-render
When React updates the UI because state or props changed.

### Virtual DOM
React's representation of the real DOM. React efficiently updates only changed parts.

### Component Tree
The hierarchy of parent/child component relationships.

### Lifting State Up
Moving state to a common ancestor component so multiple children can share it.

### Controlled Component
Form inputs whose values are controlled by React state.

### Uncontrolled Component
Form inputs that manage their own state internally (using refs).

### Single Page Application (SPA)
An app that loads once and uses client-side routing instead of full page reloads.

### Client-Side Routing
Navigation handled by JavaScript in the browser (React Router).

### Side Effect
Operations that affect something outside the component (API calls, DOM manipulation, etc.).

---

## Common Patterns in Your Code

### 1. Controlled Inputs Pattern

```jsx
// From ExpenseForm.jsx
const [enteredTitle, setEnteredTitle] = useState('');

<input
    type="text"
    value={enteredTitle}           // Controlled by state
    onChange={(event) => setEnteredTitle(event.target.value)}  // Updates state
/>
```

### 2. Filtering Pattern

```jsx
// From App.jsx
const filteredExpenses = expenses.filter((expense) => {
    return expense.date.getFullYear().toString() === filteredYear;
});
```

### 3. Lifting State Up Pattern

```jsx
// Parent (App.jsx) manages state
const [expenses, setExpenses] = useState([]);

// Child receives handler function
<ExpenseForm onSaveExpenseData={addExpenseHandler} />

// Child calls handler with data
prop.onSaveExpenseData(expenseData);
```

### 4. Async Error Handling Pattern

```jsx
try {
    const data = await ExpensesService.getAll();
    setExpenses(data);
} catch (error) {
    setError(error.message);
} finally {
    setIsLoading(false);
}
```

---

## Summary

This expense tracker demonstrates:

1. **Component Architecture**: Breaking UI into reusable pieces
2. **State Management**: Using `useState` to manage changing data
3. **Props**: Passing data and functions between components
4. **Routing**: Using React Router for multi-page navigation
5. **Persistence**: LocalStorage for client-side storage, Fetch API for server communication
6. **Event Handling**: Responding to user interactions
7. **Lists**: Rendering dynamic lists with keys
8. **Effects**: Performing side effects with `useEffect`

React's power comes from its **declarative approach** - you describe what you want the UI to look like, and React handles the "how" of updating the DOM efficiently.

