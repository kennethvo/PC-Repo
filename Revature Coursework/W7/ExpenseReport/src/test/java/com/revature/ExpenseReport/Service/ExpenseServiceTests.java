package com.revature.ExpenseReport.Service;

import com.revature.ExpenseReport.Controller.ExpenseDTO;
import com.revature.ExpenseReport.Controller.ExpenseWOIDDTO;
import com.revature.ExpenseReport.Model.Expense;
import com.revature.ExpenseReport.Repository.ExpenseRepository;
import com.revature.ExpenseReport.Repository.ReportRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExpenseServiceTests {
    // Fields
    @Mock
    private ExpenseRepository repo;

    @Mock
    private ReportRepository reportRepo;
    
    @InjectMocks
    private ReportService reportService;

    @InjectMocks
    private ExpenseService service;

    private Expense expense1;

    @BeforeEach
    void setUp() {
        expense1 = new Expense(LocalDate.of(2025, 12, 9), new BigDecimal("50.00"), "Walmart");
        expense1.setId("1");
    }

    // Constructor

    // Methods

    // Triple A
    // arrange - prepping any resources/objects we need to run our test
    // act - the action/function of executing the code/logic we're testing
    // assert - the final check to pass or fail

    /*
     * public ExpenseDTO getById(String id) {
     * 
     * Optional<Expense> res = repository.findById(id);
     * 
     * return (res.isEmpty()) ? null : ExpenseToDto(res.get());
     * }
     */
    @Test
    public void happyPath_getExpenseById_returnsExpenseDTO() {
        // Arrange
        // prep the value that should be in the db
        String id = "thisIsTheId";
        LocalDate date = LocalDate.now();
        Expense savedExpense = new Expense(date, new BigDecimal("50.00"), "Video Games");
        savedExpense.setId(id);

        // prep our expected value to compare with for the assert
        ExpenseDTO expected = new ExpenseDTO(id, date, new BigDecimal("50.00"), "Video Games");

        // "put" the fake entry in the db
        when(repo.findById(id)).thenReturn(Optional.of(savedExpense));

        // ACT
        ExpenseDTO actual = service.getById(id);

        // Assert
        // compare expected to actual
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    public void happyPath_updateExpense_correctlyUpdatesAndSaves() {

        // Arrange
        String id = "thisIsTheUpdateId";
        LocalDate date = LocalDate.now();
        Expense originalExpense = new Expense(date, new BigDecimal("50.00"), "Video Games");
        originalExpense.setId(id);

        //DTO that will come with update (is passed, should update by id)
        ExpenseDTO updateDto = new ExpenseDTO(id, date, new BigDecimal("75.00"), "Movies");


        // Expected DTO object to be returned (Must add Id)
        Expense expectedSavedExpense = new Expense(date, new BigDecimal("75.00"), "Movies");
        expectedSavedExpense.setId(id);
        ExpenseDTO expectedOutput = new ExpenseDTO(id, date, new BigDecimal("75.00"), "Movies");

        // Two repo calls are done, define them and what they should return after.

        // Repo can find original expense record
        when(repo.findById(id)).thenReturn(Optional.of(originalExpense));

        // When saved called on any expense object, return the expected savedExpense.
        when(repo.save(any(Expense.class))).thenReturn(expectedSavedExpense);


        // ACT
        // Do updated
        ExpenseDTO updateActual = service.update(id, updateDto);

        // Assert
        // Verify the returned DTO matches the expected Expense
        assertThat(updateActual).isEqualTo(expectedOutput);
    }
  
    @Test
    public void happyPath_delete_returnsNull(){
        String id = "thisIsTheId";
        LocalDate date = LocalDate.now();
        Expense savedExpense = new Expense(date, new BigDecimal("50.00"), "Video Games" );
        savedExpense.setId(id);

        when(repo.findById(id)).thenReturn(Optional.of(savedExpense), Optional.empty());

        service.delete(id);

        ExpenseDTO expected = service.getById(id);

        assertNull(expected);
    }

    @Test
    public void deleteExpense_HappyPath() {
        // Arrange
        String id = "expense-123";
        LocalDate date = LocalDate.of(2024, 2, 20);
        Expense existingExpense = new Expense(LocalDate.now(), new BigDecimal("50.00"), "Old");
        existingExpense.setId(id);
        Expense updatedExpense = new Expense(date, new BigDecimal("150.75"), "Target");
        updatedExpense.setId(id);
        ExpenseDTO updateDto = new ExpenseDTO(id, date, new BigDecimal("150.75"), "Target");
        when(repo.findById(id)).thenReturn(Optional.of(existingExpense));
        when(repo.save(any(Expense.class))).thenReturn(updatedExpense);
        // Act
        ExpenseDTO actual = service.update(id, updateDto);
        // Assert
        assertThat(actual).isEqualTo(updateDto);
    }
  
    @Test
    public void seconddeleteExpense_HappyPath() {
        // Arrange
        String id = "expense-to-delete";

        // ACT
        service.delete(id);

        // Assert
        verify(repo, times(1)).deleteById(id);
    }

    @Test
    public void happyPath_delete_deletesTheId() {
        String id = "somerandomid";

        service.delete(id);

        verify(repo, times(1)).deleteById(id);
    }

    /*
    public List<ExpenseDTO> searchByExpenseMerchant(String merchant) {
        return repository.findByExpenseMerchant(merchant).stream().map(this::ExpenseToDto).toList();
    }
     */

    @Test
    public void happyPath_searchByExpenseMerchant_ShouldReturnListOfExpenseDTOs() {
        //Arrange
        String testMerchant = "Starbucks";
        LocalDate date = LocalDate.now();

        // Create mock Expense entities (The input to the Service method)
        Expense entity1 = new Expense(date, new BigDecimal("12.50"), testMerchant);
        entity1.setId("id1");
        Expense entity2 = new Expense(date.minusDays(4), new BigDecimal("5.70"), testMerchant);
        entity2.setId("id2");
        List<Expense> mockEntities = List.of(entity1, entity2);

        // Create the expected DTOs (The output you expect)
        ExpenseDTO expectedDto1 = new ExpenseDTO("id1", date, new BigDecimal("12.50"), testMerchant);
        ExpenseDTO expectedDto2 = new ExpenseDTO("id2", date.minusDays(4), new BigDecimal("5.70"), testMerchant);
        List<ExpenseDTO> expectedDTOs = List.of(expectedDto1, expectedDto2);

        // Mock the repository call to return our predefined list of Expense entities.
        when(repo.findByExpenseMerchant(testMerchant)).thenReturn(mockEntities);

        //Act
        List<ExpenseDTO> actualDTOs = service.searchByExpenseMerchant(testMerchant);

        //Assert

        //Use recursive comparator to compare the ExpenseDTO objects to ensure the test doesn't fail due to reference inequality
        assertThat(actualDTOs)
                .usingRecursiveFieldByFieldElementComparator()
                .isEqualTo(expectedDTOs);

        //Verify that the service method correctly called the repository exactly once with the expected merchant name.
        Mockito.verify(repo, Mockito.times(1)).findByExpenseMerchant(testMerchant);
    }

    @Test
    public void happyPath_updateExpense_returnsUpdatedExpenseDTO() {
        // Arrange
        // prep the value that should be in the db
        String id = "thisIsTheId";
        LocalDate date = LocalDate.now();
        Expense savedExpense = new Expense(date, new BigDecimal("50.00"), "Video Games");
        savedExpense.setId("id");

        // prep our update DTO and expected value to compare
        ExpenseDTO updateDTO = new ExpenseDTO(id, date.plusDays(1), new BigDecimal("75.00"), "Whole Foods");
        ExpenseDTO expected = new ExpenseDTO(id, date.plusDays(1), new BigDecimal("75.00"), "Whole Foods");

        // "put" the fake entry in the db
        when(repo.findById(id)).thenReturn(Optional.of(savedExpense));
        when(repo.save(savedExpense)).thenReturn(savedExpense);

        // ACT
        ExpenseDTO actual = service.update(id, updateDTO);

        // ASSERT
        // compare expected to actual
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    public void happyPath_getExpenseByMerchant_returnsListOfExpenseDTO() {

        String id = "thisIsTheId";
        LocalDate date = LocalDate.now();
        Expense savedExpense2 = new Expense(date, new BigDecimal("99.99"), "Walmart");
        Expense savedExpense3 = new Expense(date, new BigDecimal("2000.89"), "Walmart");
        savedExpense2.setId("expense-2");
        savedExpense3.setId("expense-3");

        List<Expense> walmartExpenses = new ArrayList<>();
        walmartExpenses.add(savedExpense2);
        walmartExpenses.add(savedExpense3);


        ExpenseDTO dto1 = new ExpenseDTO(id, date, new BigDecimal("99.99"), "Walmart");
        ExpenseDTO dto2 = new ExpenseDTO(id, date, new BigDecimal("2000.89"), "Walmart");
        List<ExpenseDTO> expected = new ArrayList<>();
        expected.add(dto1);
        expected.add(dto2);

        when(repo.findByExpenseMerchant("Walmart")).thenReturn(walmartExpenses);

        // ACT
        List<ExpenseDTO> actual = service.searchByExpenseMerchant("Walmart");

        // Assert
        // compare expected to actual
        assertThat(actual).isEqualTo(expected);
    }

    @Test//
    public void thirddeleteExpense_HappyPath() {//
        // Arrange
        String id = "tmpId";

        // do nothing, and just test the deleteById functionality
        Mockito.doNothing().when(repo).deleteById(id);//

        // ACT
        // We are calling on the deleteExpense method in the service layer
        service.delete(id);//

        // Assert
        // now verify in our expense repo one time if the function works
        Mockito.verify(repo, Mockito.times(1))//
                .deleteById(id);//
    }//

    /*
    public List<ExpenseDTO> searchByExpenseMerchant(String merchant) {
        return repository.findByExpenseMerchant(merchant).stream().map(this::ExpenseToDto).toList();
    }
    */

    // public ExpenseDTO update(String id, ExpenseDTO dto) {
    //     Expense expense = repository.findById(id).orElseThrow( () -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    //     expense.setDate(dto.expenseDate());
    //     expense.setValue(dto.expenseValue());
    //     expense.setMerchant(dto.expenseMerchant());

    //     return ExpenseToDto(repository.save(expense));
    // }

    @Test
    public void BrodysHappyPath_updateExpense_returnsUpdatedExpenseDTO(){
        //Arrange
        String id = "thisIsTheId";
        LocalDate date = LocalDate.now();

        //Create "saved expense"
        Expense savedExpense = new Expense(date, new BigDecimal("50.00"), "Walmart");
        savedExpense.setId(id);

        //Create expected ExpenseDTO after update
        ExpenseDTO expected = new ExpenseDTO(id, date, new BigDecimal("100.00"), "Amazon");

        //Create expense that is used to update the saved expense
        Expense updated = new Expense(date, new BigDecimal("100.00"), "Amazon");
        updated.setId(id);

        //"put" saved expense in the db
        when(repo.findById(id)).thenReturn(Optional.of(savedExpense));
        when(repo.save(savedExpense)).thenReturn(savedExpense);

        // Act
        // Call the service update method
        ExpenseDTO actual = service.update(id, expected);

        // Assert
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    public void happyPath_update_returnsExpenseDTO() {
        // Arrange
        // prep the Expense value that should be in the db
        String id = "n6ic9e";
        LocalDate date = LocalDate.now();
        Expense savedExpense = new Expense(date, new BigDecimal("50.00"), "Video Games" );
        savedExpense.setId(id);

        // prep the new ExpenseDTO to update with
        ExpenseDTO updated = new ExpenseDTO(id, date, new BigDecimal("60.00"), "Video Games");

        // prep our expected value to compare with for the assert - should be the same as the ExpenseDTO we're sending
        ExpenseDTO expected = new ExpenseDTO(id, date, new BigDecimal("60.00"), "Video Games");

        // "put" the fake entry in the db
        when(repo.findById(id)).thenReturn(Optional.of(savedExpense));
        // "put" the updated entry in the db
        when(repo.save(any(Expense.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // ACT
        ExpenseDTO actual = service.update(id, updated);
  
        // Assert
        // compare expected to actual
        assertThat(actual).isEqualTo(expected);  
        //make sure the DTO we sent in wasn't changed
        assertThat(updated).isEqualTo(expected);
    }

    @Test
    public void sadPath_getExpenseById_returnsNullWhenNotFound() {
        // Arrange
        String id = "thisIdDoesNotExist";

        // pretend the db has no entry for this id
        when(repo.findById(id)).thenReturn(Optional.empty());

        // Act
        ExpenseDTO actual = service.getById(id);

        // Assert
        assertThat(actual).isNull();
    }

    @Test
    public void happyPath_searchExpensesByMerchant_returnsExpenseDTOList() {
        // Arrange
        LocalDate date = LocalDate.now();
        String id = "TestId";
        Expense createdExpense = new Expense(date, new BigDecimal("18.57"), "Starbucks");
        createdExpense.setId(id);

        ExpenseWOIDDTO input = new ExpenseWOIDDTO(createdExpense.getDate(),
                createdExpense.getValue(), createdExpense.getMerchant());

        // What I expect to get as result
        ExpenseDTO expected = new ExpenseDTO(id, date, new BigDecimal("18.57"),
                "Starbucks");

        when(repo.save(any())).thenReturn(createdExpense);

        // Act
        ExpenseDTO actual = service.create(input);

        // Assert
        assertThat(actual).isEqualTo(expected);
    }

    //Create an Expense Test
    @Test
    public void happyPath_createExpense_returnsExpenseDTO() {
        // Arrange
        // prep the value we want to create (without ID)
        LocalDate date = LocalDate.now();
        ExpenseWOIDDTO newExpense = new ExpenseWOIDDTO(date, new BigDecimal("75.00"), "Amazon");

        // prep the value that will be saved in the db (with ID)
        Expense savedExpense = new Expense(date, new BigDecimal("75.00"), "Amazon");
        savedExpense.setId("generatedId");

        // prep our expected value to compare with for the assert
        ExpenseDTO expected = new ExpenseDTO("generatedId", date, new BigDecimal("75.00"), "Amazon");

        // mock what happens when we save to the db
        when(repo.save(any(Expense.class))).thenReturn(savedExpense);

        // ACT
        ExpenseDTO actual = service.create(newExpense);

        // Assert
        // compare expected to actual
        assertThat(actual).isEqualTo(expected);
    }
}