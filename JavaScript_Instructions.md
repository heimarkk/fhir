# JavaScript Instructions

## Table of Contents

1. [Getting Started](#getting-started)
2. [Variables and Data Types](#variables-and-data-types)
3. [Functions](#functions)
4. [Control Flow](#control-flow)
5. [Objects and Arrays](#objects-and-arrays)
6. [Asynchronous Programming](#asynchronous-programming)
7. [DOM Manipulation](#dom-manipulation)
8. [Best Practices](#best-practices)
9. [Common Patterns](#common-patterns)
10. [Debugging](#debugging)

## Getting Started

### Prerequisites

- Text editor (VS Code recommended)
- Web browser with developer tools
- Node.js (for server-side JavaScript)

### Running JavaScript

```html
<!-- In HTML file -->
<script src="script.js"></script>
<script>
  console.log("Hello, World!");
</script>
```

```bash
# In terminal with Node.js
node script.js
```

## Variables and Data Types

### Variable Declarations

```javascript
// ES6+ preferred
let variableName = "value";
const constantName = "unchangeable";

// Avoid (legacy)
var oldStyle = "avoid using var";
```

### Data Types

```javascript
// Primitives
let string = "Hello";
let number = 42;
let boolean = true;
let nullValue = null;
let undefinedValue = undefined;
let symbol = Symbol("unique");
let bigint = 123n;

// Objects
let object = { key: "value" };
let array = [1, 2, 3];
let function = () => {};
```

### Type Checking

```javascript
console.log(typeof "hello"); // "string"
console.log(Array.isArray([1, 2, 3])); // true
console.log(value instanceof Object); // true/false
```

## Functions

### Function Declarations

```javascript
// Function declaration
function greet(name) {
  return `Hello, ${name}!`;
}

// Function expression
const greet = function (name) {
  return `Hello, ${name}!`;
};

// Arrow function (ES6+)
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Arrow function (concise)
const greet = (name) => `Hello, ${name}!`;
```

### Parameters and Arguments

```javascript
// Default parameters
function greet(name = "World") {
  return `Hello, ${name}!`;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

// Destructuring parameters
function createUser({ name, email, age = 18 }) {
  return { name, email, age };
}
```

## Control Flow

### Conditionals

```javascript
// If-else
if (condition) {
  // code
} else if (anotherCondition) {
  // code
} else {
  // code
}

// Ternary operator
const result = condition ? "true value" : "false value";

// Switch statement
switch (value) {
  case "option1":
    // code
    break;
  case "option2":
    // code
    break;
  default:
  // code
}
```

### Loops

```javascript
// For loop
for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}

// For...of (iterate over values)
for (const item of array) {
  console.log(item);
}

// For...in (iterate over keys)
for (const key in object) {
  console.log(key, object[key]);
}

// While loop
while (condition) {
  // code
}

// Do-while loop
do {
  // code
} while (condition);
```

## Objects and Arrays

### Objects

```javascript
// Object creation
const person = {
  name: "John",
  age: 30,
  greet() {
    return `Hello, I'm ${this.name}`;
  },
};

// Property access
console.log(person.name); // dot notation
console.log(person["age"]); // bracket notation

// Object methods
Object.keys(person); // ["name", "age", "greet"]
Object.values(person); // ["John", 30, function]
Object.entries(person); // [["name", "John"], ["age", 30], ...]
```

### Arrays

```javascript
// Array creation
const fruits = ["apple", "banana", "orange"];
const numbers = new Array(1, 2, 3, 4, 5);

// Array methods
fruits.push("grape"); // add to end
fruits.pop(); // remove from end
fruits.unshift("mango"); // add to beginning
fruits.shift(); // remove from beginning

// Higher-order methods
const doubled = numbers.map((num) => num * 2);
const evens = numbers.filter((num) => num % 2 === 0);
const sum = numbers.reduce((total, num) => total + num, 0);
```

## Asynchronous Programming

### Promises

```javascript
// Creating a promise
const myPromise = new Promise((resolve, reject) => {
  if (success) {
    resolve("Success!");
  } else {
    reject("Error!");
  }
});

// Using promises
myPromise
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
  .finally(() => console.log("Done"));
```

### Async/Await

```javascript
// Async function
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Using async function
fetchData().then((data) => console.log(data));
```

### Fetch API

```javascript
// GET request
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data));

// POST request
fetch("https://api.example.com/data", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ key: "value" }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## DOM Manipulation

### Selecting Elements

```javascript
// By ID
const element = document.getElementById("myId");

// By class
const elements = document.getElementsByClassName("myClass");
const element = document.querySelector(".myClass");
const elements = document.querySelectorAll(".myClass");

// By tag
const elements = document.getElementsByTagName("div");
```

### Modifying Elements

```javascript
// Content
element.textContent = "New text";
element.innerHTML = "<strong>Bold text</strong>";

// Attributes
element.setAttribute("class", "newClass");
element.getAttribute("class");
element.removeAttribute("class");

// Styles
element.style.color = "red";
element.style.backgroundColor = "blue";

// Classes
element.classList.add("newClass");
element.classList.remove("oldClass");
element.classList.toggle("active");
```

### Event Handling

```javascript
// Add event listener
element.addEventListener("click", function (event) {
  console.log("Clicked!");
});

// Arrow function event handler
element.addEventListener("click", (event) => {
  console.log("Clicked!");
});

// Remove event listener
element.removeEventListener("click", handlerFunction);

// Event object
element.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default behavior
  event.stopPropagation(); // Stop event bubbling
  console.log(event.target); // Element that triggered event
});
```

## Best Practices

### Code Style

```javascript
// Use meaningful variable names
const userAge = 25; // Good
const a = 25; // Bad

// Use const for values that don't change
const API_URL = "https://api.example.com";

// Use camelCase for variables and functions
const userName = "john_doe";
function getUserData() {}

// Use PascalCase for constructors/classes
class UserAccount {}

// Add comments for complex logic
// Calculate compound interest
const interest = principal * Math.pow(1 + rate, time) - principal;
```

### Error Handling

```javascript
// Try-catch blocks
try {
  const data = JSON.parse(jsonString);
  processData(data);
} catch (error) {
  console.error("Error parsing JSON:", error.message);
} finally {
  // Always executes
  cleanup();
}

// Validate inputs
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}
```

### Performance

```javascript
// Use strict mode
"use strict";

// Avoid global variables
(function () {
  // Your code here
})();

// Use let and const instead of var
let mutableValue = "can change";
const immutableValue = "cannot change";

// Cache DOM queries
const buttons = document.querySelectorAll(".button");
buttons.forEach((button) => {
  button.addEventListener("click", handleClick);
});
```

## Common Patterns

### Module Pattern

```javascript
// IIFE (Immediately Invoked Function Expression)
const myModule = (function () {
  let privateVariable = "private";

  function privateFunction() {
    console.log("Private function");
  }

  return {
    publicMethod() {
      return privateVariable;
    },
  };
})();
```

### Prototype Pattern

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

const person = new Person("John");
console.log(person.greet());
```

### Observer Pattern

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    }
  }
}
```

## Debugging

### Console Methods

```javascript
console.log("Basic logging");
console.error("Error message");
console.warn("Warning message");
console.info("Info message");
console.table([{ name: "John", age: 30 }]);
console.time("timer");
console.timeEnd("timer");
```

### Debugging Techniques

```javascript
// Debugger statement
function problematicFunction() {
  debugger; // Execution will pause here
  // Your code
}

// Conditional breakpoints in code
if (condition && DEBUG_MODE) {
  debugger;
}

// Error tracking
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});
```

### Browser DevTools

- **Console**: Execute JavaScript, view logs
- **Sources**: Set breakpoints, step through code
- **Network**: Monitor API requests
- **Application**: View local storage, cookies
- **Performance**: Profile code execution

## Additional Resources

### ES6+ Features

- Arrow functions
- Template literals
- Destructuring
- Spread operator
- Classes
- Modules (import/export)
- Promises
- async/await

### Useful Libraries

- **Lodash**: Utility functions
- **Axios**: HTTP client
- **Moment.js**: Date manipulation
- **jQuery**: DOM manipulation (legacy)

### Learning Resources

- MDN Web Docs
- JavaScript.info
- Eloquent JavaScript (book)
- You Don't Know JS (book series)

---

_Remember: Practice is key to mastering JavaScript. Start with small projects and gradually work on more complex applications._
