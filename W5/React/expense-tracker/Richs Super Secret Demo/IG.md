# Instructor Guide

## Phase 1 Instructor Guide: Component Architecture

Goal: Teach students how to break a UI into small, reusable pieces and pass data between them.

### 1. The Folder Structure

Have your students create a components folder inside src. Their file tree should look like this:

```markdown
src/
├── components/
│   ├── ExpenseDate.jsx
│   ├── ExpenseItem.jsx
│   └── ExpenseList.jsx
├── App.jsx
├── main.jsx
└── index.css
```

### 2. Step-by-Step Coding Logic

#### Step A: The Date Component (ExpenseDate.jsx)

- Start small. Explain that handling dates in JS is annoying, so we isolate that logic here.
- Concept: toLocaleString() to format dates into a readable string.
- Props: Receives date (Date object).

#### Step B: The Item Component (ExpenseItem.jsx)

- This is the "Card" the user sees.
- Concept: Importing other components. They must add import ExpenseDate from './ExpenseDate'; at the top.
- Props: Receives title, amount, date.

#### Step C: The List Component (ExpenseList.jsx)

- This handles the collection.
- Concept: The .map() array method.
- Crucial: Explain the key prop. React uses this to track which items change. Without it, performance suffers and bugs occur.
- Imports: import ExpenseItem from './ExpenseItem';

#### Step D: The App Component (App.jsx)

- The orchestrator.
- Imports: import ExpenseList from './components/ExpenseList'; (Note the path!).
- Data: Define the expenses array here. Explain that in the future, this will come from an API/Backend.

### 3. Common Student Errors to Watch For

- Missing Imports: Forgetting to import ExpenseDate inside ExpenseItem.
- Path Errors: Importing from ./ExpenseItem instead of ./components/ExpenseItem (or vice versa depending on where they are).
- Curly Brace Syntax: Writing title instead of {title} inside JSX.
- Date Objects: Passing a string "2024-01-01" instead of a new Date() object, causing .getFullYear() to crash in the Date component.

---

## Phase 2 Instructor Guide: State & Events

Goal: Teach students how to capture user input and update the UI dynamically.

### 1. File Structure Update

Ideally, create a new folder src/components/NewExpense to house the form logic.

``` markdown
src/
├── components/
│   ├── NewExpense/       <-- NEW FOLDER
│   │   └── ExpenseForm.jsx
│   ├── ExpenseDate.jsx
│   ├── ExpenseItem.jsx
│   └── ExpenseList.jsx
├── App.jsx
...
```

### 2. Step-by-Step Coding Logic

#### Step A: The ExpenseForm Component

- This is where the user interaction happens.
- The Hook: Introduce useState. Explain that variables in React don't update the UI when they change; only State updates the UI.
- Listening: Add onChange props to inputs.
- Gathering: Create a submitHandler function.
- The "Gotcha": Explain event.preventDefault(). Without this, the browser will reload the page and the React app will restart, losing the data.

#### Step B: Two-Way Binding

- Concept: Notice we set value={enteredTitle} on the input.
- Why? This lets us clear the form after submission (setEnteredTitle('')). The state controls the input, and the input controls the state. It's a loop.

#### Step C: Lifting State Up (The Hardest Concept)

- This is usually where students get stuck. Draw a diagram on the whiteboard.
- Parent (App) defines a function: addExpenseHandler.
- Parent passes that function to Child (ExpenseForm) as a prop: onSaveExpenseData.
- Child calls that function when the form submits: props.onSaveExpenseData(data).
- Result: The child has successfully "pushed" data up to the parent.

#### Step D: Updating Arrays in State

- In App.jsx, when adding the new item:
- Wrong Way: setExpenses([newItem, ...expenses])
- Right Way: setExpenses(prevExpenses => [newItem, ...prevExpenses])
- Why? React schedules state updates. If you update rapidly, the "Wrong Way" might rely on stale data. The "Right Way" guarantees you have the most recent array.

### 3. Common Student Errors

- Forgot preventDefault: The page refreshes when they click "Add Expense".
- State is a String: event.target.value is always a string, even for `<input type="number">`. You must convert it (e.g., +enteredAmount) if you want to do math later.
- Undefined Prop: Trying to call props.onSaveExpenseData but forgetting to pass it in App.jsx (`<ExpenseForm />` instead of `<ExpenseForm onSaveExpenseData={...} />`).

---

## Phase 3 Instructor Guide: Derived State & Lists

Goal: Teach students how to filter data and render dynamic reports.

### 1. File Structure Update

Add the Charting components to a new folder to keep things organized.

``` markdown
src/
├── components/
│   ├── Chart/             <-- NEW FOLDER
│   │   ├── Chart.jsx
│   │   └── ChartBar.jsx
│   ├── Expenses/          <-- REORGANIZE EXISTING
│   │   ├── ExpensesFilter.jsx
│   │   └── ExpensesChart.jsx
│   ├── NewExpense/
│   │   └── ExpenseForm.jsx
...
```

### 2. Step-by-Step Coding Logic

#### Step A: The Filter Logic (App.jsx & ExpensesFilter.jsx)

- Controlled Components: Explain that the `<select>` in ExpensesFilter doesn't manage its own state. It receives its value (props.selected) from App and notifies App of changes (props.onChangeFilter). This makes App the "Single Source of Truth."
- Derived State: This is a critical best practice.
- Bad Practice: Creating a filteredExpenses state and trying to update it whenever expenses or year changes. This leads to "State Synchronization" bugs.
- Good Practice: const filteredExpenses = expenses.filter(...) inside the render function. It recalculates automatically whenever the component re-renders.

#### Step B: The Chart Logic (Chart.jsx & ChartBar.jsx)

- Reusability: Chart is a "Dumb Component". It doesn't know about money or dates. It just knows "Label" and "Value". This makes it reusable for other things later (e.g., "Miles Driven per Month").
- Dynamic Styling: Show how to use the style={{ }} prop in React to dynamically set the height of the bar based on the percentage calculation.

#### Step C: Data Transformation (ExpensesChart.jsx)

- The Adapter Pattern: This component acts as a bridge. It takes the domain-specific data (Expenses) and transforms it into the format the UI component expects (Chart Data Points).
- Looping: It iterates through the expenses and sums up the amounts into monthly buckets (Jan, Feb, Mar, etc.).

### 3. Teaching "Conditional Rendering"

- In ExpenseList.jsx, notice we check `items.length === 0`
- Demonstrate this by selecting a year with no data (e.g., 2026).
- Explain that this provides a better User Experience (UX) than just showing a blank space.

### 4. Common Student Errors

- Filter not working: Usually happens because they are comparing a Number (from Date) to a String (from Select). Ensure they use .toString() or parseInt() so the types match.
- Chart bars empty: Often a math error. Dividing by zero (if maxMonth is 0) results in Infinity or NaN. Ensure the code handles the case where the max value is 0.

---

## Phase 4 Instructor Guide: Selection & Reports

Goal: Teach students how to manage selection state (checkboxes) and derive a new "view" (the report) based on that selection.

### 1. File Structure Update

Add the Report component.

``` markdown
src/
├── components/  
│   ├── Report/            <-- NEW FOLDER  
│   │   └── ReportSummary.jsx  
│   ├── Expenses/  
...  
```

### 2. Step-by-Step Coding Logic

#### Step A: Managing Selection State (App.jsx)

- The Concept: We need to know which items are selected.
- The State: `const [selectedIds, setSelectedIds] = useState([])` We use an array of strings (IDs).
- The Toggle Logic: This is a classic interview question/pattern.
- IF the ID exists in the array → filter it out (remove it).
- IF the ID does not exist → [...spread] it in (add it).

#### Step B: The Checkbox (ExpenseItem.jsx)

- Controlled Component: The checkbox checked prop is controlled by props.isSelected. The onChange calls props.onToggle(id).
- Prop Drilling: Note how the toggle function must be passed from App -> ExpenseList -> ExpenseItem.

#### Step C: Derived Data (App.jsx)

- Before passing data to the ReportSummary, we calculate the subset:

```markdown
const reportExpenses = expenses.filter(expense =>
  selectedIds.includes(expense.id)
);
```

- Explain that we don't need a separate state for reportExpenses. It is derived from expenses and selectedIds.

#### Step D: The Modal (ReportSummary.jsx)

- Conditional Rendering: In App.jsx, we use `{isReportVisible && <ReportSummary />}`.
- Aggregation: Inside ReportSummary, we use .reduce() to calculate the total sum of the selected items. This is a great time to teach the JavaScript .reduce() method if the class is advanced enough, otherwise a for...of loop works fine too.

### 3. Common Student Errors

- Mutating State: attempting to use .push() on the selectedIds array. Remind them to always return a new array using spread syntax `[...prev, newId]`.
- Prop Drilling: Forgetting to pass the id prop to ExpenseItem so it knows which item to toggle.
- Key Prop: When rendering the table rows in the Report, forgetting the key prop again.

---

## Phase 5 Instructor Guide: Client-Side Persistence

Goal: Teach students how to synchronize React state with LocalStorage using useEffect.

### 1. The Strategy: Hybrid Persistence

- Explain to the class the architecture we are building:
- Expenses: These represent "Live Data" (shared by a team). In the next phase, these will come from a Server/API. If you refresh, you should fetch the latest from the server.
- Reports: These represent "User Data" (drafts, history). These are perfect for LocalStorage because they are specific to this browser/user and we want them to persist even if the internet goes down.

### 2. Step-by-Step Coding Logic

#### Step A: Lazy Initialization

- Look at the savedReports state in App.jsx.
- Concept: Usually, we pass a value: useState([]).
- Problem: Reading from LocalStorage is an I/O operation. If we do const stored = localStorage.getItem(...) inside the component body, it runs on every single render.
- Solution: Pass a Function to useState.

``` markdown
const [state, setState] = useState(() => {
   // This code ONLY runs the very first time the component mounts.
   const saved = localStorage.getItem('key');
   return saved ? JSON.parse(saved) : initialValue;
});
```

#### Step B: The useEffect Hook

- Concept: "Synchronize with an external system."
- The Dependency: [savedReports].
- The Logic: Whenever savedReports changes (User adds a report OR deletes a report), React runs this effect to update LocalStorage.
- Serialization: Remind students that localStorage only stores strings. We must use JSON.stringify().

#### Step C: Verification

- Generate a report and click "Save".
- Refresh the browser page.
- Result: The "Expense List" resets (because it's hardcoded), but the "Saved Reports" section remains populated!

### 3. Common Student Errors

- Infinite Loops: If they put setSavedReports inside the useEffect that listens to savedReports, they will create an infinite loop.

- JSON Errors: If LocalStorage has bad data (e.g., from a previous project), JSON.parse might crash the app. It's good practice to wrap the read logic in a try/catch block (as shown in the solution code).

---

## Phase 6 Instructor Guide: Server-Side Persistence

Goal: Replace hardcoded data with a real HTTP Service connected to a REST API.

### 1. Prerequisites: Setting up json-server

- Before writing the React code, the students need a "Backend."
- Install json-server:

``` markdown
npm install -g json-server
```

- Create the Database File: Create a file named db.json in the project root (outside src) and paste the content provided in the db.json code block.
- Run the Server: Open a new terminal window (keep the React terminal running) and run:

``` markdown
json-server --watch db.json --port 3000
```

- Verify it works by visiting http://localhost:3000/expenses in the browser.

### 2. Step-by-Step Coding Logic

#### Step A: The Service Pattern (expenseService.js)

- Create a new file src/services/expenseService.js.
- Why? Explain "Separation of Concerns." The React component should care about displaying data, not fetching it.
- The Code:

``` markdown
const baseUrl = 'http://localhost:3000/expenses';

export const getAllExpenses = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) throw new Error('Could not fetch');
  return response.json();
};

export const createExpense = async (data) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

#### Step B: Fetching on Mount (useEffect)

- In App.jsx:
  - Loading State: Add const [isLoading, setIsLoading] = useState(false);
  - Error State: Add const [error, setError] = useState(null);
  - The Effect: Use useEffect(() => { ... }, []) to run once on load.
  - Crucial: You cannot mark the useEffect callback as async. You must define an async function inside it and call it immediately.

``` markdown
useEffect(() => {
    async function loadData() {
        // fetch logic here
    }
    loadData();
}, []);
```

#### Step C: Handling Dates (The API Disconnect)

- The Problem: The API returns date as a String ("2025-08-14"). Our previous code expected a Date Object.
- The Fix: You can either:
  - Map over the data immediately after fetching and convert strings to Date objects.
  - Or (Recommended): Update ExpenseItem to accept a string and convert it on the fly: const dateObj = new Date(props.date);. This is often more robust.

#### Step D: Async Form Submission

- Update addExpenseHandler to be async.
- Set Loading to true.
- await expenseService.create(data).
- Update state with the result (which now includes the real ID from the server!).
- Set Loading to false.

### 3. Common Student Errors

- CORS Errors: Usually json-server handles this, but if they use a different backend, they might hit Cross-Origin issues.
- "Objects are not valid as a React child": Often happens if error state is an Object instead of a String.
- Infinite Loop: Putting fetch in useEffect but adding expenses as a dependency. It fetches -> updates expenses -> triggers effect -> fetches again...

---

## Phase 7 Instructor Guide: React Router

Goal: Teach Client-Side Routing using react-router-dom.

### 1. Installation

Have students stop their dev server and run:

`npm install react-router-dom`

### 2. Setting up the Router

- In main.jsx (the entry point), wrap the App with BrowserRouter.

``` markdown
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

### 3. Creating Pages

- Create a new folder src/pages. This separates "Views" from "Components".
- pages/DashboardPage.jsx: Contains the ExpenseList, ExpenseFilter, and SavedReports.
- pages/AddExpensePage.jsx: Contains the ExpenseForm.

### 4. Refactoring App.jsx

- Explain that App.jsx is no longer the "UI Container", but the "Traffic Cop".
- Import Components: Routes, Route from 'react-router-dom'.
- Define Routes:

``` markdown
<Routes>
  <Route path="/" element={<DashboardPage ... />} />
  <Route path="/add" element={<AddExpensePage ... />} />
</Routes>
```

### 5. Navigation & Links

- The Problem with <a> tags: Explain that <a href="/add"> triggers a browser refresh. We lose all our state (like expenses if they haven't saved to server yet)!
- The Solution: Use <Link to="/add">. It changes the URL via the History API without reloading the page.

### 6. programmatic Navigation

- In AddExpensePage, after a successful submission, we want to go back to the dashboard automatically.
- Hook: useNavigate()
- Usage:

``` markdown
const navigate = useNavigate();
// ... inside async submit handler ...
await submitData();
navigate('/'); // Redirect user
```

---

## Topic Review

### 1. Props (Passing Data Down)

The Concept: React components are like JavaScript functions. Props are just the arguments you pass into those functions. They allow a parent component to control a child component.

In your Demo: Look at DashboardPage. It needs to display the list of expenses.

```JavaScript
<ExpenseList items={expenses} ... />
```

Here, items is the prop. The ``DashboardPage` (Parent) is passing the expenses array (Data) down to `ExpenseList` (Child).

The Rule: Props are Read-Only. `ExpenseList` can read items, but it cannot change them. If it tries to say `items = []`, React will throw an error. Data flows Down.

### 2. Prop Drilling (The "Bucket Brigade")

The Concept: This happens when you need to get data from the very top of your app to the very bottom, but the components in the middle don't actually need that data—they just pass it along.

In your Demo: Look at the `toggleExpenseHandler` (the checkbox logic).

Defined in `App`: The logic lives here because the State lives here.

Passed to `DashboardPage`: `DashboardPage` doesn't use it, it just accepts it to pass it down.

Passed to `ExpenseList`: `ExpenseList` doesn't use it either!

Passed to `ExpenseItem`: Finally, the `<input onChange...>` uses it.

Why it matters: It makes code harder to maintain. If you renamed that function, you'd have to update 4 different files. (We solve this in advanced React using Context, which is like a teleportation tunnel for data).

### 3. Hooks (The "Magic")

Hooks allow functional components to "hook into" React features like state and lifecycle. They always start with use.

#### A. useState (The Memory)

Standard variables in functions disappear when the function finishes running. `useState` allows a component to "remember" data between renders.

In your Demo:

``` JavaScript
const [enteredTitle, setEnteredTitle] = useState('');
```

If you just used `let title = ''`, every time React re-drew the form, the variable would reset to empty. `useState` keeps the text there while the user types.

#### B. useEffect (The Synchronizer)

This is the hardest hook for beginners. Think of it as: "When [X] happens, do [Y]."

In your Demo (Fetching Data):

```JavaScript
useEffect(() => {
   fetchExpenses();
}, []); // <--- Empty Dependency Array
```

Translation: "When this component first appears on screen (mounts), go fetch data."

In your Demo (Saving Reports):

```JavaScript
useEffect(() => {
   localStorage.setItem(...);
}, [savedReports]); // <--- Dependency Array has 'savedReports'
```

Translation: "Whenever savedReports changes, run this code to save it to the browser."

### 4. Lifting State Up (Data Flowing Up)

The Concept: Since data only flows down (via Props), how does a child (like a Form) tell the Parent (App) that something happened?

The Solution: The Parent passes a Function down as a prop. The Child calls that function as if it were a remote control.

In your Demo:

`App` creates `addExpenseHandler`.

It passes it to `AddExpensePage` -> `ExpenseForm` as `props.onSaveExpenseData`.

When the user clicks Submit, `ExpenseForm` calls:

```JavaScript
props.onSaveExpenseData(expenseData);
```

This triggers the function inside `App`, passing the data up.

### 5. Derived State (Efficiency)

The Concept: Beginners often store too much in State. If you can calculate something based on existing state, do not create new state for it. Calculate it on the fly.

In your Demo: You have a filter for the year. You could have created a state called `const [visibleExpenses, setVisibleExpenses] = useState(...)`.

Instead, you did this:

``` JavaScript
const filteredExpenses = expenses.filter((expense) => {
   return expense.date.getFullYear().toString() === filteredYear;
});
```

Why this is better: `filteredExpenses` is recalculated every time the component renders. If `expenses` changes (server data comes in) OR if `filteredYear` changes (user picks 2023), `filteredExpenses` updates automatically. You never have to worry about "syncing" two different states.

### 6. Conditional Rendering

The Concept: Showing or hiding UI elements based on state.

In your Demo:

``` JavaScript
{isLoading && <div ...>Loading...</div>}
```

This is a "Short Circuit". If `isLoading` is true, it renders the div. If false, React ignores the rest of the line.

Also in ExpenseList:

```JavaScript
if (items.length === 0) return <p>No expenses found.</p>;
```

This is an "Early Return". It prevents the rest of the component from running if there is no data to show.
