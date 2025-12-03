package com.revature.ExpenseReport.Service;

import com.revature.ExpenseReport.Controller.ExpenseDTO;
import com.revature.ExpenseReport.Controller.ExpenseWOIDDTO;
import com.revature.ExpenseReport.Model.Expense;
import com.revature.ExpenseReport.Repository.ExpenseRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    // Fields
    private final ExpenseRepository repository;

    // Constructor
    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    // Methods
    public List<ExpenseDTO> getAllExpenses() {
        // repo method returns list of expenses . . .
        // need to convert every expense on the list to DTO
        // keep/put back in a list to return
        return repository.findAll().stream().map(this::ExpensetoDTO).toList();
    }

    public List<ExpenseDTO> searchByExpenseMerchant(String merchant) {
        return repository.findByExpenseMerchant(merchant).stream().map(this::ExpensetoDTO).toList();
    }

    public ExpenseDTO create(ExpenseWOIDDTO dto) {
        Expense entity = new Expense(dto.expenseDate(), dto.expenseValue(), dto.expenseMerchant());
        return ExpensetoDTO(repository.save(entity));
    }

    public ExpenseDTO getByID(String id) {
        Optional<Expense> res = repository.findById(id);
        
        return (res.isEmpty() ? null : ExpensetoDTO(res.get()));
    }

    public ExpenseDTO update(String id, ExpenseDTO dto) {
        Expense expense = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        expense.setDate(dto.expenseDate());
        expense.setValue(dto.expenseValue());
        expense.setMerchant(dto.expenseMerchant());
        
        return ExpensetoDTO(repository.save(expense));
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    private ExpenseDTO ExpensetoDTO(Expense expense) {
        return new ExpenseDTO(expense.getId(), expense.getDate(), expense.getValue(), expense.getMerchant());
    }
}
