# Full Stack Study Guide - React + Spring Boot

## 🎯 Interview Preparation Overview

Based on your trainer's notes, you need to:
- **Frontend**: React project
- **Backend**: Spring Boot API
- **Topics**: RESTful APIs, CRUD operations
- **Time**: 3 hours (9 AM - 12 PM)
- **Format**: 5 MC questions frontend, 5 MC questions backend

---

## 📚 **PRIMARY PROJECTS TO STUDY**

### **1. ExpenseReport Project (W6 & W7) - Spring Boot Backend**
**Location**: `W6/ExpenseReport/` and `W7/ExpenseReport/`

This is your **BEST example** of a complete Spring Boot REST API with CRUD operations.

#### **Key Files to Study (in order):**

1. **Controller Layer** (REST API endpoints):
   - `src/main/java/com/revature/ExpenseReport/Controller/ExpenseController.java`
     - **Study**: How `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` work
     - **Focus**: Complete CRUD operations (Create, Read, Update, Delete)
     - **Note**: Line 20-55 shows all CRUD endpoints
   
   - `src/main/java/com/revature/ExpenseReport/Controller/ReportController.java`
     - **Study**: Another complete CRUD example
   
   - `src/main/java/com/revature/ExpenseReport/Controller/ExpenseDTO.java`
     - **Study**: Data Transfer Objects (DTOs) - why we use them
   
   - `src/main/java/com/revature/ExpenseReport/Controller/ExpenseWOIDDTO.java`
     - **Study**: DTOs without ID (for POST requests)

2. **Service Layer** (Business Logic):
   - `src/main/java/com/revature/ExpenseReport/Service/ExpenseService.java`
     - **Study**: How service layer converts between Entity and DTO
     - **Focus**: Methods like `getAllExpenses()`, `create()`, `getById()`, `update()`, `delete()`
     - **Note**: Line 26-63 shows complete CRUD service methods

3. **Repository Layer** (Data Access):
   - `src/main/java/com/revature/ExpenseReport/Repository/ExpenseRepository.java`
     - **Study**: Spring Data JPA repository interface
     - **Focus**: How `JpaRepository` provides CRUD methods automatically
     - **Note**: Custom query method `findByExpenseMerchant()`

4. **Model/Entity Layer**:
   - `src/main/java/com/revature/ExpenseReport/Model/Expense.java`
     - **Study**: JPA annotations (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`, `@ManyToOne`)
     - **Focus**: How Java classes map to database tables

5. **Configuration**:
   - `src/main/resources/application.properties`
     - **Study**: Database connection, JPA settings

6. **Testing** (Important for understanding):
   - `src/test/java/com/revature/ExpenseReport/Service/ExpenseServiceTests.java`
     - **Study**: How to test service layer with Mockito

#### **What to Learn from ExpenseReport:**
- ✅ Complete RESTful API structure
- ✅ All CRUD operations (GET, POST, PUT, DELETE)
- ✅ Spring Boot layered architecture (Controller → Service → Repository)
- ✅ DTO pattern (why we use DTOs vs Entities)
- ✅ Spring Data JPA repository methods
- ✅ Request mapping annotations
- ✅ Path variables (`@PathVariable`) and request parameters (`@RequestParam`)

---

### **2. React Expense Tracker (W5) - Frontend**
**Location**: `W5/React/expense-tracker/`

This is your **BEST example** of a React frontend that connects to a backend API.

#### **Key Files to Study (in order):**

1. **Main App Component**:
   - `src/App.jsx`
     - **Study**: React hooks (`useState`, `useEffect`)
     - **Focus**: How to fetch data from API on component mount
     - **Focus**: How to handle async operations (lines 35-57)
     - **Focus**: CRUD handlers: `addExpenseHandler()`, `deleteExpenseHandler()` (lines 59-98)
     - **Note**: React Router setup with `Routes` and `Route`

2. **Service Layer** (API calls):
   - `src/services/ExpensesService.jsx`
     - **Study**: How to make HTTP requests with `fetch()`
     - **Focus**: GET, POST, DELETE methods (lines 5-27)
     - **Focus**: How to structure API service
     - **Note**: Base URL configuration, error handling

3. **Components**:
   - `src/components/ExpenseForm.jsx`
     - **Study**: Form handling with React
     - **Focus**: Controlled components (`value`, `onChange`)
     - **Focus**: Form submission (lines 25-39)
   
   - `src/components/Expenses/ExpenseList.jsx`
     - **Study**: Rendering lists in React
   
   - `src/components/pages/Navigation.jsx`
     - **Study**: React Router navigation

4. **Entry Point**:
   - `src/main.jsx`
     - **Study**: How React app is initialized
     - **Focus**: BrowserRouter setup

#### **What to Learn from React Expense Tracker:**
- ✅ React component structure
- ✅ State management with `useState`
- ✅ Side effects with `useEffect`
- ✅ Making HTTP requests to backend API
- ✅ Handling async operations (async/await)
- ✅ Form handling and controlled components
- ✅ React Router for navigation
- ✅ Error handling in React

---

## 📖 **DOCUMENTATION FILES TO READ**

### **Week 6 Documentation** (Spring Boot & REST)

1. **`W6/3-spring_mvc_rest.md`** ⭐ **MUST READ**
   - Complete guide to Spring MVC and RESTful APIs
   - Explains `@RestController`, `@Controller`
   - Shows all HTTP method annotations
   - Complete CRUD example (lines 244-295)
   - Path variables and request parameters
   - **Read this FIRST before looking at code**

2. **`W6/1-spring_intro_di.md`**
   - Introduction to Spring Framework
   - Dependency Injection concepts
   - Spring Boot basics

3. **`W6/2-spring_boot_config.md`**
   - Spring Boot configuration
   - Application properties
   - Auto-configuration

4. **`W6/5-spring_data_jpa.md`**
   - Spring Data JPA repositories
   - Query methods
   - Entity relationships

### **Week 7 Documentation** (Advanced REST & Transactions)

1. **`W7/2-transactions_and_rest.md`** ⭐ **IMPORTANT**
   - Transaction management
   - REST API best practices
   - Error handling
   - Response status codes

2. **`W7/1-spring_data_intro.md`**
   - Spring Data JPA introduction
   - Repository patterns

---

## 🎓 **LEARNING PATH**

### **Phase 1: Understand RESTful APIs & CRUD (2-3 hours)**

1. **Read**: `W6/3-spring_mvc_rest.md` (focus on CRUD section)
2. **Study**: `W6/ExpenseReport/Controller/ExpenseController.java`
   - Map each annotation to its purpose:
     - `@GetMapping` = READ (GET request)
     - `@PostMapping` = CREATE (POST request)
     - `@PutMapping` = UPDATE (PUT request)
     - `@DeleteMapping` = DELETE (DELETE request)
3. **Study**: `W6/ExpenseReport/Service/ExpenseService.java`
   - Understand how service methods implement business logic
4. **Study**: `W6/ExpenseReport/Repository/ExpenseRepository.java`
   - See how JPA provides CRUD methods automatically

### **Phase 2: Understand Spring Boot Architecture (2-3 hours)**

1. **Read**: `W6/1-spring_intro_di.md` (Dependency Injection)
2. **Study**: How ExpenseController receives ExpenseService (constructor injection)
3. **Study**: How ExpenseService receives ExpenseRepository
4. **Read**: `W6/5-spring_data_jpa.md` (Repositories)
5. **Study**: `W6/ExpenseReport/Model/Expense.java` (Entity mapping)

### **Phase 3: Understand React Frontend (2-3 hours)**

1. **Study**: `W5/React/expense-tracker/src/App.jsx`
   - Focus on `useEffect` hook for fetching data (lines 35-57)
   - Focus on async handlers (lines 59-98)
2. **Study**: `W5/React/expense-tracker/src/services/ExpensesService.jsx`
   - Understand how to structure API calls
   - Learn fetch() API usage
3. **Study**: `W5/React/expense-tracker/src/components/ExpenseForm.jsx`
   - Learn form handling in React
4. **Practice**: Try to trace the flow:
   - User fills form → `ExpenseForm` → `App.jsx` → `ExpensesService.postExpense()` → Backend API

### **Phase 4: Connect Frontend to Backend (1-2 hours)**

1. **Understand**: How React frontend calls Spring Boot backend
   - Frontend: `ExpensesService.jsx` uses `fetch('http://localhost:3000/expenses')`
   - Backend: `ExpenseController.java` handles `/api/expenses`
2. **Note**: The ports might be different in your setup, but the concept is the same
3. **Study**: How data flows:
   - React Component → Service → HTTP Request → Spring Controller → Service → Repository → Database

---

## 🔍 **KEY CONCEPTS TO MASTER**

### **RESTful API Concepts:**

1. **HTTP Methods**:
   - `GET` - Read/Retrieve data
   - `POST` - Create new resource
   - `PUT` - Update entire resource
   - `PATCH` - Partial update
   - `DELETE` - Remove resource

2. **Spring Annotations**:
   - `@RestController` - Marks class as REST controller
   - `@RequestMapping` - Base URL mapping
   - `@GetMapping` - Handle GET requests
   - `@PostMapping` - Handle POST requests
   - `@PutMapping` - Handle PUT requests
   - `@DeleteMapping` - Handle DELETE requests
   - `@PathVariable` - Extract from URL path (`/api/expenses/{id}`)
   - `@RequestParam` - Extract from query string (`?merchant=Walmart`)
   - `@RequestBody` - Extract JSON from request body

3. **Spring Boot Layers**:
   - **Controller** - Handles HTTP requests/responses
   - **Service** - Business logic
   - **Repository** - Data access (database)
   - **Model/Entity** - Database table representation

### **React Concepts:**

1. **Hooks**:
   - `useState` - Manage component state
   - `useEffect` - Side effects (API calls, subscriptions)
   - `useNavigate` - Navigation (React Router)

2. **API Integration**:
   - `fetch()` - Make HTTP requests
   - `async/await` - Handle asynchronous operations
   - Error handling with try/catch

3. **Component Structure**:
   - Functional components
   - Props (passing data down)
   - State (component's own data)
   - Event handlers

---

## 📝 **PRACTICE EXERCISES**

### **Backend Practice:**
1. **Read** `ExpenseController.java` and identify:
   - Which method handles GET all expenses?
   - Which method handles GET by ID?
   - Which method handles creating a new expense?
   - Which method handles updating?
   - Which method handles deleting?

2. **Trace the flow** for creating an expense:
   - Request comes to `ExpenseController.create()`
   - Calls `ExpenseService.create()`
   - Service creates `Expense` entity
   - Calls `ExpenseRepository.save()`
   - Returns DTO to controller
   - Controller returns JSON response

### **Frontend Practice:**
1. **Read** `App.jsx` and identify:
   - When does the app fetch expenses? (Hint: `useEffect`)
   - How does it handle the response?
   - How does it handle errors?

2. **Trace the flow** for adding an expense:
   - User submits form in `ExpenseForm`
   - Calls `prop.onSaveExpenseData(expenseData)`
   - This triggers `addExpenseHandler()` in `App.jsx`
   - Calls `ExpensesService.postExpense(expense)`
   - Makes POST request to backend
   - Updates state with new expense

---

## 🎯 **INTERVIEW FOCUS AREAS**

### **Backend (Spring Boot) - 5 MC Questions:**
1. **RESTful API annotations** - Know what each annotation does
2. **CRUD operations** - Understand GET, POST, PUT, DELETE
3. **Spring Boot layers** - Controller, Service, Repository
4. **Spring Data JPA** - Repository methods, entity relationships
5. **Request handling** - Path variables, request params, request body

### **Frontend (React) - 5 MC Questions:**
1. **React hooks** - useState, useEffect
2. **API calls** - fetch(), async/await
3. **Component lifecycle** - When data is fetched
4. **State management** - How state is updated
5. **Form handling** - Controlled components, form submission

---

## 📂 **QUICK REFERENCE - File Locations**

### **Backend (Spring Boot):**
```
W6/ExpenseReport/src/main/java/com/revature/ExpenseReport/
├── Controller/
│   ├── ExpenseController.java      ← CRUD endpoints
│   ├── ExpenseDTO.java             ← Data Transfer Object
│   └── ExpenseWOIDDTO.java         ← DTO without ID
├── Service/
│   └── ExpenseService.java         ← Business logic
├── Repository/
│   └── ExpenseRepository.java      ← Data access
└── Model/
    └── Expense.java                ← Entity/Model
```

### **Frontend (React):**
```
W5/React/expense-tracker/src/
├── App.jsx                         ← Main component, state, API calls
├── services/
│   └── ExpensesService.jsx         ← API service layer
└── components/
    ├── ExpenseForm.jsx             ← Form component
    └── Expenses/
        └── ExpenseList.jsx         ← List component
```

### **Documentation:**
```
W6/
├── 3-spring_mvc_rest.md            ← REST API guide (READ FIRST)
├── 1-spring_intro_di.md            ← Spring basics
├── 2-spring_boot_config.md        ← Configuration
└── 5-spring_data_jpa.md            ← JPA repositories

W7/
└── 2-transactions_and_rest.md     ← Advanced REST
```

---

## 💡 **TIPS FOR SUCCESS**

1. **Start with documentation** - Read `W6/3-spring_mvc_rest.md` first to understand concepts
2. **Then read code** - Study `ExpenseController.java` to see concepts in action
3. **Trace the flow** - Follow a request from React → Spring Boot → Database
4. **Practice reading code** - Don't just read, understand WHY each line exists
5. **Focus on patterns** - CRUD operations follow the same pattern everywhere
6. **Understand the layers** - Controller → Service → Repository is key
7. **Know the annotations** - Most Spring Boot questions will test annotation knowledge

---

## 🚀 **STUDY CHECKLIST**

- [ ] Read `W6/3-spring_mvc_rest.md` completely
- [ ] Study `ExpenseController.java` - understand all CRUD methods
- [ ] Study `ExpenseService.java` - understand service layer
- [ ] Study `ExpenseRepository.java` - understand repository pattern
- [ ] Study `Expense.java` - understand entity mapping
- [ ] Study `App.jsx` - understand React state and API calls
- [ ] Study `ExpensesService.jsx` - understand fetch() API
- [ ] Study `ExpenseForm.jsx` - understand form handling
- [ ] Trace complete flow: User action → React → API → Spring Boot → Database
- [ ] Practice identifying: Which annotation does what?
- [ ] Practice identifying: Which HTTP method for which operation?

---

**Good luck with your interview! Focus on understanding the patterns, not memorizing code. The concepts are more important than syntax.**
