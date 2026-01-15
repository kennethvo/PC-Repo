 /*
 function greetUser() {
        let name = document.getElementById("nameInput").value;
        alert("Hello, " + name + "!");
      }
  
  
  
  function getUserInput(){
      const userInput = prompt("Please enter a number: ");
      return userInput;
 }
      function squareNumber(number){
        return number * number;
      }
      function displaySquare(){
        const input = getUserInput();
        const square = squareNumber(input);
        alert("The square of " + input + " is " + square);
      }

      console.log("Hello from the external script!");


*/

      function sayHello() {
  alert("Hello from the external file!");
}

// Connect the function to the button
let btn = document.getElementById("helloBtn");
btn.addEventListener("click", sayHello);