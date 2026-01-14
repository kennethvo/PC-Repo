# Quick Reference - React + Spring Boot Interview Prep

## 🎯 **TOP 2 PROJECTS TO FOCUS ON**

### **1. Backend: W6/ExpenseReport/**
**Why**: Complete Spring Boot REST API with all CRUD operations

**Key Files (Study in this order):**
1. `Controller/ExpenseController.java` - REST endpoints (lines 20-55)
2. `Service/ExpenseService.java` - Business logic (lines 26-63)
3. `Repository/ExpenseRepository.java` - Data access
4. `Model/Expense.java` - Entity mapping

### **2. Frontend: W5/React/expense-tracker/**
**Why**: React app that connects to backend API

**Key Files (Study in this order):**
1. `src/App.jsx` - Main component with state & API calls (lines 35-98)
2. `src/services/ExpensesService.jsx` - HTTP requests (lines 5-27)
3. `src/components/ExpenseForm.jsx` - Form handling

---

## 📖 **MUST-READ DOCUMENTATION**

1. **`W6/3-spring_mvc_rest.md`** ⭐ **READ FIRST**
   - Complete REST API guide
   - CRUD examples (lines 244-295)

2. **`W7/2-transactions_and_rest.md`**
   - Advanced REST concepts

---

## 🔑 **KEY CONCEPTS**

### **Spring Boot REST Annotations:**
- `@RestController` - REST controller
- `@RequestMapping("/api/expenses")` - Base URL
- `@GetMapping` - GET request (READ)
- `@PostMapping` - POST request (CREATE)
- `@PutMapping` - PUT request (UPDATE)
- `@DeleteMapping` - DELETE request (DELETE)
- `@PathVariable` - URL path variable (`/{id}`)
- `@RequestParam` - Query parameter (`?merchant=Walmart`)
- `@RequestBody` - JSON request body

### **Spring Boot Layers:**
```
Controller → Service → Repository → Database
```

### **React Concepts:**
- `useState` - Component state
- `useEffect` - Side effects (API calls)
- `fetch()` - HTTP requests
- `async/await` - Asynchronous operations

---

## 📋 **CRUD OPERATIONS**

### **Backend (Spring Boot):**
```java
@GetMapping              // READ all
@GetMapping("/{id}")     // READ one
@PostMapping             // CREATE
@PutMapping("/{id}")     // UPDATE
@DeleteMapping("/{id}")  // DELETE
```

### **Frontend (React):**
```javascript
fetch(url)                    // GET (READ)
fetch(url, {method: 'POST'})  // POST (CREATE)
fetch(url, {method: 'PUT'})   // PUT (UPDATE)
fetch(url, {method: 'DELETE'}) // DELETE
```

---

## 🎓 **STUDY ORDER**

1. **Read**: `W6/3-spring_mvc_rest.md` (30 min)
2. **Study**: `W6/ExpenseReport/Controller/ExpenseController.java` (30 min)
3. **Study**: `W6/ExpenseReport/Service/ExpenseService.java` (30 min)
4. **Study**: `W5/React/expense-tracker/src/App.jsx` (30 min)
5. **Study**: `W5/React/expense-tracker/src/services/ExpensesService.jsx` (20 min)
6. **Practice**: Trace a request from React → Spring Boot (20 min)

**Total: ~2.5 hours**

---

## ✅ **CHECKLIST**

- [ ] Understand what each Spring annotation does
- [ ] Know all CRUD operations (GET, POST, PUT, DELETE)
- [ ] Understand Spring Boot layers (Controller → Service → Repository)
- [ ] Know React hooks (useState, useEffect)
- [ ] Understand how to make API calls with fetch()
- [ ] Can trace data flow: React → API → Spring Boot → Database

---

**See STUDY_GUIDE.md for detailed explanations!**
