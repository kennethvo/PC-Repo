
2025-11-03 09:58

Tags: [[revature]], [[Java]]

# Revature - Day 6
### Software Development Life Cycle 
#### Planning
- planning and requirements are separate.
- focus more on the objective
#### Implementation
- end to end?
#### Testing
#### Deployment
- deployment has changed a lot.
- finish testing and put it out (physically or on websites, etc.)
#### Monitor / Maintenance

### Agile and Waterfall
- Agile is more of an iterative methodology, with the project going through changes after deployment if needed
	- designed by nature to be very flexible
	- MVP - keep developing on top of the base MVP, keep updating and iterating and improve upon what's created
	- things ARE gonna change as you go but it's part of the evolution process
- Waterfall is linear. gives us a very clear endpoint and rigid plan

### Misc.
- IntelliJ Maven and library searches
- 11:23 the output and why it auto calls toString?
- Object references
- GSON

### IRepos
```java
public interface IRepository {
	public void saveExpenses(List<Expense> expenses) {}
}
```
- use this to do something like `IRepository repo = new JSONRepository();` and use the repo object to save into a file.

```java
public class JSONRepo or CSV or TextRepo implements IRepository {
	// Fields
	private String filename = "test.json.csv.txt";
	
	// Constructor
	public JSONRepo() {}

	public void saveExpenses(List<Expense> expense) {
		try {
			// diff writers etc depending on the file type
		} catch
	}
}
```

# References
[[Revature - Day 5]]
[[Rev Training - Java]]