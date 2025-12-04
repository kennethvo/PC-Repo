# JavaScript Tutorial Series

These beginner-friendly challenges will help you learn JavaScript step-by-step using only your browser.  
No special setup or installation required — just use the browser console and a simple HTML file!

## Recording Your Results

While many of these are simple challenges, please remember that part of our training to being able to prove what you know and what you learned along the way.
We want to keep building good habits of tracking our work through Git. We'll be continuing to build out the repo that you started earlier for the HTML challenges.
As you complete each Task, please create a branch with the task name/number (task_8), push the branch to your repo, then merge it into the main branch of your repo.
**You should NOT be committing directly to the main branch.**
For tasks that do not generate any artifacts (files), please include a screen shot of the browser console in your branch.

---

## Task 1: Hello JavaScript (Console Basics)

**Goal:** Run your first JavaScript code directly in the browser.

1. Open any website.
2. Press `F12` or `Ctrl + Shift + I` to open **Developer Tools**.
3. Click the **Console** tab.
4. Type this and press Enter:

```js
console.log("Hello, JavaScript!");
````

You should see:

```
Hello, JavaScript!
```

JavaScript is an interpreted language, meaning that it can be executed line by line without pre-compiling.  
Modern web browsers come ready to interpret JS out of the box!

### Bonus

Try using JavaScript as a calculator:

```js
5 + 3
10 * 2
(100 / 4) + 7
```

---

## Task 2: Working with Variables

**Goal:** Practice creating and using variables in JavaScript.

In the console, type:

```js
let name = "Jordan";
let age = 25;

console.log("Name:", name);
console.log("Age:", age);
```

Then change the values:

```js
name = "Alex";
age = age + 5;

console.log("Updated age:", age);
```

### Mini Challenge

Create variables for your favorite color, movie, and number, then log them all in one sentence.

Even though we're interpreting line by line, you can still store things in application memory (thanks to the browser, we borrow some of its memory to make this work).

---

## Task 3: Functions in the Console

**Goal:** Learn how to create and call your own functions.

In the console, type:

```js
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Taylor");
```

Then create a function that adds two numbers:

```js
function add(a, b) {
  return a + b;
}

console.log(add(3, 7));
```

In an interpreted environment, it's the `function` keyword and `{` character that tell the interpreter "hey, i've got more to do"  
and lets us keep writing on the next line.  

### Mini Challenge

Write a function called `square()` that takes a number and returns its square.
Example: `square(4)` → `16`

---

## Task 4: Running JavaScript in a Web Page

**Goal:** Run JavaScript from an HTML file instead of the console.

1. Open a text editor (like VS Code or Notepad).
2. Create a file called `index.html`.
3. Copy this code and save it:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First JS Page</title>
  </head>
  <body>
    <h1>Hello, JavaScript in HTML!</h1>
    <script>
      console.log("This code runs from inside the web page!");
      let message = "Welcome to JavaScript!";
      console.log(message);
    </script>
  </body>
</html>
```

4. Open the file in your browser.
5. Press `F12` → open the **Console** to see the output.

"In-Line" script tags are the first way to get an HTML document to run JavaScript for us,  
we'll look at others in a little bit.

---

## Task 5: Trigger a Function from HTML

**Goal:** Connect HTML elements to JavaScript functions using events.

Use this example:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>JS Button Example</title>
  </head>
  <body>
    <h1>Click the Button!</h1>

    <button onclick="sayHello()">Say Hello</button>

    <script>
      function sayHello() {
        alert("Hello from JavaScript!");
      }
    </script>
  </body>
</html>
```

`onclick` is just one event we can use. Think about anything that you've done on a website that triggered a reaction:  

- clicks
- hovering
- selecting
- keystrokes

anything that we can detect can be a trigger for a function.

### Mini Challenge

Add another button that runs a new function when clicked.
Example:

- Button text: "Tell me a joke"
- Function displays an `alert()` with a funny message.

---

## Task 6: Using Input Fields

**Goal:** Get user input from a text box and display a message.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Greeting Input</title>
  </head>
  <body>
    <h2>Enter your name:</h2>
    <input type="text" id="nameInput" placeholder="Your name here">
    <button onclick="greetUser()">Greet Me</button>

    <script>
      function greetUser() {
        let name = document.getElementById("nameInput").value;
        alert("Hello, " + name + "!");
      }
    </script>
  </body>
</html>
```

### Mini Challenge

Modify the function so that if the input is empty, it alerts:

> “Please enter your name first!”

---

## Task 7: Combining It All

**Goal:** Build a simple mini app that uses everything so far.

Create an HTML page with:

- A number input box
- A button that squares the number
- An alert showing the result

**Hint:**

- Use `document.getElementById()` to get the input
- Use your earlier `square()` function

Example result:

```javascript
Enter a number: 4
[Square It!] → Alert: "The square is 16"
```

---

**Recommended Reading:**

- [MDN JavaScript First Steps](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps)
- [W3Schools JavaScript Tutorial](https://www.w3schools.com/js/)
- [JavaScript.info - The Modern Tutorial](https://javascript.info)

---

# Part 2

### Working with External Script Files

Now that you’ve written JavaScript directly in the browser and inside HTML files, it’s time to organize your code using **external `.js` files**.

---

## Task 8: Linking an External Script

**Goal:** Move your JavaScript code into a separate file.

1. Create two files in the same folder:
   - `index.html`
   - `script.js`

2. Add this code to **index.html**:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>External Script Example</title>
  </head>
  <body>
    <h1>External JavaScript Demo</h1>
    <p>Open the console to see the message.</p>

    <!-- Link the external script file -->
    <script src="script.js"></script>
  </body>
</html>
````

3. Add this code to **script.js**:

```js
console.log("Hello from the external script!");
```

4. Open `index.html` in your browser and check the **Console**.
   You should see the message logged from `script.js`.

> **Tip:** Always include your `<script>` tag **just before `</body>`**, so the HTML loads first before the JS runs.
Yes, there are times where we want the script to run first, but not for what we're doing here.

---

## Task 9: Connecting HTML Elements to External JavaScript

**Goal:** Move your event-handling functions into an external script.

### index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Button Script Example</title>
  </head>
  <body>
    <h1>Click the Button!</h1>
    <button id="helloBtn">Say Hello</button>

    <script src="script.js"></script>
  </body>
</html>
```

### script.js

```js
function sayHello() {
  alert("Hello from the external file!");
}

// Connect the function to the button
let btn = document.getElementById("helloBtn");
btn.addEventListener("click", sayHello);
```

Now when you click the button, it should display an alert.

### Mini Challenge

Add another button labeled **"Goodbye"** that triggers a `sayGoodbye()` function from your `script.js` file.

---

## Task 10: Working with User Input Externally

**Goal:** Use an external script to handle user input and display results.

### index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <title>External Input Example</title>
  </head>
  <body>
    <h2>Enter your name:</h2>
    <input type="text" id="nameInput" placeholder="Your name here">
    <button id="greetBtn">Greet Me</button>

    <script src="script.js"></script>
  </body>
</html>
```

### script.js

```js
function greetUser() {
  let name = document.getElementById("nameInput").value;
  if (name.trim() === "") {
    alert("Please enter your name first!");
  } else {
    alert("Hello, " + name + "!");
  }
}

document.getElementById("greetBtn").addEventListener("click", greetUser);
```

### Mini Challenge

Add a second input field for the user’s **favorite color**.
When the button is clicked, greet the user *and* mention their color in the message.

---

## Task 11: Simple Calculator (External Script)

**Goal:** Build a basic calculator using an external script file.

### index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Simple Calculator</title>
  </head>
  <body>
    <h1>Calculator</h1>

    <input type="number" id="num1" placeholder="First number">
    <input type="number" id="num2" placeholder="Second number">
    <button id="addBtn">Add</button>

    <p id="result"></p>

    <script src="script.js"></script>
  </body>
</html>
```

### script.js

```js
function addNumbers() {
  let n1 = Number(document.getElementById("num1").value);
  let n2 = Number(document.getElementById("num2").value);
  let sum = n1 + n2;

  document.getElementById("result").textContent = "Result: " + sum;
}

document.getElementById("addBtn").addEventListener("click", addNumbers);
```

### Mini Challenge

Add buttons for **Subtract**, **Multiply**, and **Divide**, each calling their own function.

---

**Recommended Reading:**

- [MDN – Adding JavaScript to a Web Page](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript#adding_javascript_to_a_page)
- [JavaScript.info – The Script Tag](https://javascript.info/script)
- [W3Schools – JS HTML DOM Tutorial](https://www.w3schools.com/js/js_htmldom.asp)

---

# 🌐 DOM Manipulation with JavaScript

The **Document Object Model (DOM)** represents the structure of a webpage.  
JavaScript can read and modify the DOM to change how the page looks and behaves — without reloading!

---

## What Is the DOM?

When a web page loads, the browser creates a **DOM tree** that represents every element on the page.

For example, this HTML:

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>Hello!</h1>
    <p>This is a paragraph.</p>
  </body>
</html>
````

...is represented in the DOM as a hierarchy:

```
Document
 └── html
      └── body
           ├── h1
           └── p
```

JavaScript can interact with this structure to **select, change, create, or remove** elements dynamically.

---

## Selecting Elements

You can access elements in the DOM using **selectors**:

```js
document.getElementById("myId");
document.getElementsByClassName("myClass");
document.getElementsByTagName("p");
document.querySelector("h1");            // first <h1>
document.querySelectorAll(".highlight"); // all elements with class="highlight"
```

### Example

```html
<h2 id="title">Welcome!</h2>

<script>
  let heading = document.getElementById("title");
  console.log(heading.textContent);
</script>
```

---

## Changing Text and HTML

You can change the text or HTML content of an element:

```html
<p id="message">Original text</p>

<script>
  let message = document.getElementById("message");
  message.textContent = "This is new text!";
  // or:
  // message.innerHTML = "<strong>Bold new text!</strong>";
</script>
```

### Task 12 : Changing Content

Create a page with a heading and a button.
When the button is clicked, change the heading text to “You clicked the button!”

---

## Changing Styles

You can modify an element’s style directly through JavaScript.

```html
<p id="text">Change my color!</p>

<script>
  let text = document.getElementById("text");
  text.style.color = "blue";
  text.style.fontSize = "24px";
</script>
```

### Task 13: Style Switcher

Create two buttons:

- One makes a paragraph **red and bold**
- The other resets it to normal text

---

## Creating and Removing Elements

JavaScript can create new HTML elements and add them to the page dynamically.

```html
<div id="container"></div>

<script>
  let container = document.getElementById("container");

  let newItem = document.createElement("p");
  newItem.textContent = "This paragraph was added with JS!";
  container.appendChild(newItem);
</script>
```

You can also remove elements:

```js
container.removeChild(newItem);
```

### Task 14: Add a List Item

Create a list (`<ul>`).
Add a button that appends a new `<li>` with the text “New Item” each time it’s clicked.

---

## Changing Attributes

You can read or modify an element’s attributes, like `src`, `href`, or `alt`.

```html
<img id="myImage" src="cat.jpg" alt="Cat">

<script>
  let img = document.getElementById("myImage");
  img.src = "dog.jpg";
  img.alt = "Dog";
</script>
```

### Task 15: Image Switcher

Place an image and a button on the page.
Each time the button is clicked, toggle the image between two different sources (e.g., `cat.jpg` ↔ `dog.jpg`).

---

## Event Listeners

The **`addEventListener()`** method lets you run code when something happens, like a click or key press.

```html
<button id="clickMe">Click Me</button>

<script>
  document.getElementById("clickMe").addEventListener("click", function() {
    alert("Button clicked!");
  });
</script>
```

### Task 16: Color Changer

Create a button that changes the background color of the page each time it’s clicked.
Use `document.body.style.backgroundColor`.

---

## Class Manipulation

Use `.classList` to add, remove, or toggle CSS classes dynamically.

```html
<style>
  .highlight {
    background-color: yellow;
    font-weight: bold;
  }
</style>

<p id="text">Click to highlight me!</p>

<script>
  let text = document.getElementById("text");
  text.addEventListener("click", function() {
    text.classList.toggle("highlight");
  });
</script>
```

### Task 17: Dark Mode Toggle

Add a “Toggle Dark Mode” button that switches the page between light and dark themes by toggling a CSS class on the `<body>` element.

---

## Putting It All Together

Combine everything you’ve learned!

### Mini Project: Interactive To-Do List

**Goal:** Create a to-do list that lets users:

- Add tasks
- Mark tasks as completed
- Remove tasks

**Example structure:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>To-Do List</title>
    <style>
      .done {
        text-decoration: line-through;
        color: gray;
      }
    </style>
  </head>
  <body>
    <h1>My To-Do List</h1>
    <input type="text" id="taskInput" placeholder="New task">
    <button id="addTask">Add</button>
    <ul id="taskList"></ul>

    <script src="script.js"></script>
  </body>
</html>
```

### script.js

```js
let input = document.getElementById("taskInput");
let button = document.getElementById("addTask");
let list = document.getElementById("taskList");

button.addEventListener("click", function() {
  let taskText = input.value.trim();
  if (taskText === "") return;

  let li = document.createElement("li");
  li.textContent = taskText;

  li.addEventListener("click", function() {
    li.classList.toggle("done");
  });

  list.appendChild(li);
  input.value = "";
});
```

---

**Recommended Reading:**

- [MDN – Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- [JavaScript.info – Modifying the Document](https://javascript.info/modifying-document)
- [W3Schools – JavaScript HTML DOM](https://www.w3schools.com/js/js_htmldom.asp)

---

# Arrow Functions in JavaScript

## What Are Arrow Functions?

Arrow functions are a **shorter, more modern way** to write functions in JavaScript.  
They were introduced in **ES6 (ECMAScript 2015)** and are often used for cleaner, more concise code — especially in callbacks and functional programming (like `map`, `filter`, or `forEach`).

---

## Basic Syntax

### Regular Function

```js
function greet(name) {
  return `Hello, ${name}!`;
}
````

### Equivalent Arrow Function

```js
const greet = (name) => {
  return `Hello, ${name}!`;
};
```

Both versions return the same result when called with:

```js
greet("Alice"); // "Hello, Alice!"
```

---

## Simplifying Arrow Functions

If the function body is a **single expression**, you can omit the `{}` and the `return` keyword:

```js
const greet = name => `Hello, ${name}!`;
```

Notes:

- Parentheses `()` around parameters can be **omitted** if there’s only one parameter.
- If there are **zero or multiple parameters**, parentheses **are required**:

  ```js
  const sayHello = () => 'Hello!';
  const add = (a, b) => a + b;
  ```

---

## Examples

### Simple Math

```js
const multiply = (x, y) => x * y;
console.log(multiply(3, 4)); // 12
```

### Using with Array Methods

```js
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
```

### Filtering

```js
const ages = [12, 18, 21, 16, 30];
const adults = ages.filter(age => age >= 18);
console.log(adults); // [18, 21, 30]
```

### Returning Objects

When returning an object literal, wrap it in parentheses:

```js
const makeUser = (name, age) => ({ name, age });
console.log(makeUser("Alice", 25)); // { name: "Alice", age: 25 }
```

---

## Important Differences from Regular Functions

Arrow functions **do not have their own `this`**.
Instead, they **inherit `this` from their surrounding scope** (called *lexical scoping*).

This makes them great for event handlers or callbacks, but not ideal for methods in objects that need their own `this`.

Example:

```js
const person = {
  name: "Sam",
  sayName: () => {
    console.log(this.name); // ❌ undefined — `this` doesn't refer to `person`
  }
};
```

Use a regular function when you need `this` to refer to the object:

```js
const person = {
  name: "Sam",
  sayName() {
    console.log(this.name); // ✅ "Sam"
  }
};
```

---

### Task 18: Shorten It

Convert this function into an arrow function:

```js
function square(n) {
  return n * n;
}
```

✅ **Goal:**
Write it using the shortest valid arrow function form.

---

### Task 19: Map and Arrow

Use the array `.map()` method and an arrow function to create a new array of the **squares** of these numbers:

```js
const nums = [1, 2, 3, 4, 5];
```

Expected result:

```js
[1, 4, 9, 16, 25]
```

---

### Task 20: Filtering with Arrow

Create an array of **even numbers only** from this list using `.filter()` and an arrow function:

```js
const numbers = [10, 15, 20, 25, 30];
```

Expected result:

```js
[10, 20, 30]
```

---

### Task 21: Arrow Function Returning Object

Write an arrow function named `makeBook` that takes two parameters — `title` and `author` — and returns an object like:

```js
{ title: "Book Title", author: "Author Name" }
```

---

## Summary

| Feature         | Regular Function      | Arrow Function             |
| --------------- | --------------------- | -------------------------- |
| Syntax          | Longer                | Shorter, concise           |
| `this` keyword  | Own `this` context    | Lexically inherited        |
| Good for        | Methods, constructors | Callbacks, short utilities |
| Implicit return | ❌                     | ✅ (if one-line expression) |

---

> 🧭 **Tip:** Arrow functions are great for short, focused logic — but don’t overuse them.
> Use regular functions when you need clear structure or access to `this`.

---

# JavaScript Fetch Requests and APIs

## Making Requests

In JavaScript, we use the **`fetch()`** function to make HTTP requests and handle the responses asynchronously.

---

## The `fetch()` Function

The syntax looks like this:

```js
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Work with the data
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
````

### Breakdown

- `fetch(url)` sends a request to the given URL.
- `.then(response => response.json())` converts the response body into a JavaScript object.
- The next `.then()` handles the resulting data.
- `.catch()` handles any errors that occur.

---

## Example: Fetching Data from an API

You can try this in your browser console or an external `.js` file linked to an HTML page.

```js
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => {
    console.log('Fetched post:', data);
  })
  .catch(error => console.error('Error fetching data:', error));
```

---

## Task 22: Display API Data on a Webpage

**Goal:** Use JavaScript to fetch and display data from an API on the page.

1. Create an HTML page with a `<div id="output"></div>`.
2. Fetch a post from `https://jsonplaceholder.typicode.com/posts/1`.
3. Display the post’s title and body inside the `output` div.

**Hint:**

```js
document.getElementById('output').innerHTML = `<h2>${data.title}</h2><p>${data.body}</p>`;
```

---

## Task 23: Fetch Multiple Items

**Goal:** Fetch a list of posts and display the first five.

**Steps:**

1. Use the endpoint `https://jsonplaceholder.typicode.com/posts`.
2. Use `slice(0, 5)` to select the first five posts.
3. Create HTML for each post and append them to the page dynamically.

**Hint:**

```js
posts.slice(0, 5).forEach(post => {
  const item = document.createElement('div');
  item.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
  document.body.appendChild(item);
});
```

---

## Task 24: Add a Button to Trigger Fetch

**Goal:** Only fetch data when the user clicks a button.

**Steps:**

1. Add a `<button id="loadBtn">Load Posts</button>` to your HTML.
2. Add an event listener that runs your fetch code when clicked.

**Hint:**

```js
document.getElementById('loadBtn').addEventListener('click', () => {
  // Fetch and display posts here
});
```

---

## Task 25: Create a Simple Search Interface

**Goal:** Let users fetch a post by entering an ID.

**Steps:**

1. Add an `<input id="postId" type="number" />` and a `<button id="fetchBtn">Fetch Post</button>`.
2. When clicked, get the value of `postId`.
3. Fetch from `https://jsonplaceholder.typicode.com/posts/{id}`.
4. Display the result.

**Hint:**

```js
const id = document.getElementById('postId').value;
fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('output').innerHTML = `<h2>${data.title}</h2><p>${data.body}</p>`;
  });
```

---

## Task 26: Handle Errors Gracefully

What happens if a user enters a non-existent ID?

Try adding:

```js
if (!data.title) {
  document.getElementById('output').innerHTML = 'No post found.';
}
```

Or use `response.ok` to check if the request succeeded:

```js
fetch(url)
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Fetch error:', error));
```

---

## Summary

- `fetch()` is used for network requests.
- Responses must often be converted using `.json()`.
- `.then()` handles asynchronous data once it’s available.
- `.catch()` helps deal with errors.
- You can connect fetch requests with DOM manipulation for interactive pages.

---

## Extra Practice Ideas

1. Create a button that loads a random post (use `Math.random()`).
2. Display user data from `https://jsonplaceholder.typicode.com/users`.
3. Make a small “load more” feature that fetches and adds new posts to the list each time you click a button.

---

**Recommended Reading**

### Fetch Requests and APIs

- **MDN – Fetch API**  
  Official documentation on making network requests in JavaScript.  
  👉 [https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

- **freeCodeCamp – How to Use Fetch**  
  Beginner tutorial on GET and POST requests with examples.  
  👉 [https://www.freecodecamp.org/news/how-to-use-the-javascript-fetch-api-to-get-data/](https://www.freecodecamp.org/news/how-to-use-the-javascript-fetch-api-to-get-data/)

- **JSONPlaceholder API**  
  A free, fake REST API for testing and learning fetch requests.  
  👉 [https://jsonplaceholder.typicode.com/](https://jsonplaceholder.typicode.com/)

### Async Programming

- **MDN – Promises**  
  Understand how asynchronous operations work with `.then()` and `.catch()`.  
  👉 [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

- **MDN – async/await**  
  Learn how to write cleaner asynchronous code.  
  👉 [https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises#async_and_await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises#async_and_await)

- **JavaScript.info – Async/Await**  
  A clear walkthrough of modern async syntax and error handling.  
  👉 [https://javascript.info/async-await](https://javascript.info/async-await)

---
