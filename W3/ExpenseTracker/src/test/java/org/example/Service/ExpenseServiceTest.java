package org.example.Service;

import org.example.Expense;
import org.example.Repository.IRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;

@ExtendWith(MockitoExtension.class)
public class ExpenseServiceTest {
    @Mock
    IRepository mockRepo;

    @InjectMocks
    private ExpenseService service;

    @Test
    public void testServiceIsCreated(){
        // Arrange

        // Act

        // Assert
//        assertEquals( );
//        assertTrue();
    }

    @Test
    public void testSummingExpenses(){
        // Arrange
        List<Expense> expenses = new ArrayList<>();
        expenses.add(new Expense(1, new Date(), 99.95, "Walmart"));
        expenses.add(new Expense(2, new Date(), 85.75, "Costco"));
        expenses.add(new Expense(3, new Date(), 10000, "Private Jet"));

//        IRepository mockRepo = mock(IRepository.class);
        when(mockRepo.loadExpenses()).thenReturn(expenses);

//        ExpenseService service = new ExpenseService(mockRepo);

        // Act
        double actual = service.sumExpenses();

        // Assert
        assertEquals(10185.70, actual);
        verify(mockRepo, times(2)).loadExpenses();

    }

    @Test
    public void createExpenseReturnsExpense(){
        // Arrange
        // three repo methods to mock: readExpense, createExpense, loadExpenses

        List<Expense> expenses = new ArrayList<>();
        expenses.add(new Expense(1, new Date(), 99.95, "Walmart"));
        expenses.add(new Expense(2, new Date(), 85.75, "Costco"));
        expenses.add(new Expense(3, new Date(), 10000, "Private Jet"));

        Expense expected = new Expense(4, new Date(), 50, "Revature");

        when(mockRepo.readExpense(4)).thenReturn(null);

        // Act
        Expense actual = service.createNewExpense(4,50, "Revature");

        // Assert
        assertEquals(expected.getId(), actual.getId());
        assertEquals(expected.getValue(), actual.getValue());
        assertEquals(expected.getMerchant(),actual.getMerchant());

        verify(mockRepo, times(5)).createExpense(any(Expense.class));
    }
}






