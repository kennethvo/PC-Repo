package com.revature.ExpenseReport.Controller;

import com.revature.ExpenseReport.Model.Expense;
import com.revature.ExpenseReport.Service.ExpenseService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/expenses") // domain:port/api/expenses
public class ExpenseController {
    // Fields
    private final ExpenseService service;

    // Constructor
    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    // Methods
    @GetMapping // domain:port/api/expenses
    public List<ExpenseDTO> getAllExpenses() {
        return service.getAllExpenses(); // all of the expenses!
    }

    @PostMapping
    public ExpenseDTO create(@RequestBody ExpenseWOIDDTO expensedto) {
        return service.create(expensedto);
    }

    // expense lookup by > a val? > $100

    // get expense by id
    @GetMapping("/{id}")
    public ExpenseDTO getByID(@PathVariable String id) {
        return service.getByID(id);
    }

    // update expense
    @PutMapping("/{id}")
    public ExpenseDTO update(@PathVariable String id, @RequestBody ExpenseDTO expensedto) {
        return service.update(id, expensedto);
    }

    // delete expense
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
