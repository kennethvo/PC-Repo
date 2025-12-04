
2025-11-04 08:58

Tags: [[revature]], [[SQL]], [[Java]]

# Revature - Day 7

### Loading from files into Objects
- i want to save and retrieve from loadExpenses();
	- if you implement a new method into an interface, you need to implement that method to all classes that implement interface

to start we created loadExpenses(); in the JSONRepo

#### JSON
```java
public List<Expense> loadExpenses() {
	FileReader reader = new FileReader(filename);
	gson.fromJson(reader);
}
```
how do we tell it to create expenses for us?
- `TypeToken`, pass the type of expense into it (in this case a list of expense)

```java
import com.google.gson.reflect.TypeToken;

public List<Expense> loadExpenses() {
	FileReader reader = new FileReader(filename);
	
	Type listExpenseType = new TypeToken<List<Expense>>();
	
	return gson.fromJson(reader, listExpenseType);
}
```
take what we get back from `gson`. and put it into a list called expenses to check if its empty to return either an empty list or the list you got
Why is `TypeToken` still erroring?
- you need to implement `getType`
```java
import com.google.gson.reflect.TypeToken;

public List<Expense> loadExpenses() {
	try {
		FileReader reader = new FileReader(filename);
		Type listExpenseType = new TypeToken<List<Expense>>(){}.getType();
		List<Expense> expenses = gson.fromJson(reader, listExpenseType);
		return (expenses != null) ? expenses : new ArrayList<>(); // if expenses is not null just return the list as normal if it is null return an empty array list
	} catch (IOException e) {
		System.out.println("JSON file not found/unreadable!");
		return new ArrayList<>();
	}
}
```
9:51 Pranav question write down
what is an anonymous function/subclass?
- a class or method created on the fly. 
before testing, you still need to initialize `loadExpenses()` in the other Repo classes
```java
static void main() {
	IRepository repo = new JSONRepo();
	
	expenses = repo.loadExpenses(); // initialize in those other classes for this to work
}
```
- deserializing - taking that file content and turning it back into an object is exactly what this is

#### Moving onto CSV
```java
public List<Expense> loadExpenses() {
	
	String line; // used to create larger conditions for the while loop
	List<Expense> expenses = new ArrayList<>();
	
	try {
		BufferedReader reader = new BufferedReader(new FileReader(filename));
		while((line = reader.readLine()) != null) { // be ready to add this to a try catch
			// read in the line from the file
			
			// parts used to read in values of the CSV
			String[] parts = line.split(","); // split the line on the commas
			int id = Integer.parseInt(parts[0]); // assigning individual values back to types/variables
			Date date = new Date(parts[1]);
			double value = Double.parseDouble(parts[2]);
			String merchant = parts[3];
			
			// create object/expense from individual variables
			expenses.add(new Expense(id, date, value, merchant)); // add the new expense to collection/list of expenses
		}
	} catch (IOException e) {
		System.out.println("Error reading from CSV file!");
		return expenses;
	}
	
	return expenses;
}
```
why do we need to put in `filereader`?
- instead of creating `filereader` in memory, we can just create both `filereader` and `bufferedreader` at the same time for memory efficiency

#### Text
```java
public List<Expense> loadExpenses() {
	
	try {
		FileReader reader = new fileReader(filename);
		String text = reader.readAllAsString();
		
		// split expenses on ]
		String[] lines = text.split("],");
		
		for (String line : lines) {
			// split when it hits a , then when it hits an =
			String[] element = line.split(",|="); 
		}
	} catch (IOException e) {
		System.out.println("Error reading text file!");
	}
	
	return new ArrayList<>();
	
	// remove the ]]
	
}
```
- the initial setup to parse through the strings, not efficient (originally had nested loops)
```java
public List<Expense> loadExpenses() {
	
	try {
		FileReader reader = new fileReader(filename);
		String text = reader.readAllAsString();
		
		// split expenses on ]
		String[] lines = text.split("],");
		
		for (String line : lines) {
			// split when it hits a , then when it hits an =
			String[] element = line.split(",|=");  // each element is one serialized expense
			
			int id = Integer.parseInt(element[1]);
			Date date = new Date(element[3]);
			double value = Double.parseDouble(element[5]);
			String merchant = element[7];
			
			expenses.add(new Expense(id, date, value, merchant));
		}
	} catch (IOException e) {
		System.out.println("Error reading text file!");
	}
	
	return expenses;
	
	// remove the ]]
	
}
```
- added loading into an object
- avoided nested loops and large time complexity times

1:33 another pranav question

#### Service Layer
Main -> Service -> Repo
- the main shouldn't know anything about repo, service should act like a middle main
- use the service layer to validate, while main can focus more on user input

#### Unit Testing
- we need to boil it down to true or false (did it work as intended or not)
to test service we create an `ExpenseServiceTest` class
```java
public class ExpenseTest {
	
	main() {
		
	}
	
	public static void testExpenseCreation() {
		// Arrange conditions for your test
		Expense expense = new Expense(1, new Date(), 100, "DummyMerch");
		
		// ACT - what functionality are you trying to validate
		int possibleID - expense.getId();
		double possibleValue - expense.getValue();
		
	}
}
```

JUnit - main testing framework for java
- add dependencies
- 
# References