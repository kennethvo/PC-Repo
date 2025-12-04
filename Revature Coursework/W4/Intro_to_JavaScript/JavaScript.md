# JavaScript is Not JAVA

## What Is JavaScript?

- JS is a programing language
- JS is one of the most widely used languages
- Generally used with front end/webdev
- JS runs in modern browsers directly
- JS is an interpreted language (no compiling necessary!)
- JS is a function language
- JS is dynamically typed

You can run JavaScript:
- In the browser console (press `F12` → Console tab) (we'll be using this for the majority of our JS)
- In online editors (like [Replit](https://replit.com) or [JSFiddle](https://jsfiddle.net))
- Using Node.js on your computer

---

## Variables

Variables in JS are dynamic. You can create them using `let`, `const`, or `var`.

```js
let name = "Alice";
const pi = 3.14159;
var age = 25;

console.log(name); // Output: Alice
````

* `let`: can be reassigned
* `const`: cannot be reassigned
* `var`: older keyword (avoid in modern JS)

---

## Data Types

Common JavaScript data types include:

| Type    | Example                      | Description            |
| ------- | ---------------------------- | ---------------------- |
| String  | `"Hello"`                    | Text data              |
| Number  | `42`, `3.14`                 | Numeric values         |
| Boolean | `true`, `false`              | True/false logic       |
| Array   | `[1, 2, 3]`                  | Ordered list of values |
| Object  | `{ name: "Alice", age: 25 }` | Key-value pairs        |

```js
let student = {
  name: "Jordan",
  enrolled: true,
  grades: [85, 90, 92]
};

console.log(student.name);      // "Jordan"
console.log(student.grades[1]); // 90
```

---

## Operators

JavaScript supports arithmetic, comparison, and logical operators.

```js
let x = 10;
let y = 3;

console.log(x + y);  // 13
console.log(x - y);  // 7
console.log(x * y);  // 30
console.log(x / y);  // 3.333...
console.log(x % y);  // 1

console.log(x > y);   // true
console.log(x === y); // false
console.log(x !== y); // true
```

---

## Conditional Statements

Use `if`, `else if`, and `else` to make decisions in your code.

```js
let score = 85;

if (score >= 90) {
  console.log("Excellent!");
} else if (score >= 70) {
  console.log("Good job!");
} else {
  console.log("Keep trying!");
}
```

---

## Loops

Loops allow you to repeat code multiple times.

```js
// For loop
for (let i = 0; i < 5; i++) {
  console.log("Loop number:", i);
}

// While loop
let count = 0;
while (count < 3) {
  console.log("Counting:", count);
  count++;
}
```

---

## Functions

Functions are reusable blocks of code that perform a specific task.

```js
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Alice");
greet("Bob");
```

You can also use **arrow functions** (a newer syntax):

```js
const add = (a, b) => a + b;

console.log(add(3, 5)); // 8
```

---

## Arrays

Arrays are ordered lists of values.

```js
let colors = ["red", "green", "blue"];

console.log(colors[0]); // "red"
colors.push("purple");
console.log(colors);    // ["red", "green", "blue", "purple"]

for (let color of colors) {
  console.log(color);
}
```

---

## Objects

Objects group related data and behavior together.

```js
let car = {
  make: "Toyota",
  model: "Camry",
  year: 2020,
  honk: function() {
    console.log("Beep beep!");
  }
};

console.log(car.make); // "Toyota"
car.honk();            // "Beep beep!"
```

---

## User Input (Browser Only)

In the browser, you can get input from users using `prompt()` and display messages with `alert()`.

```js
let name = prompt("What is your name?");
alert("Hello, " + name + "!");
```

> Note: These only work in browsers, not in Node.js.

---

## Next Steps

Once you’re comfortable with these examples, move on to the challenges.md file for your next tasks.

**Recommended Resources:**

* [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
* [JavaScript.info](https://javascript.info)
* [W3Schools JavaScript Tutorial](https://www.w3schools.com/js/)

