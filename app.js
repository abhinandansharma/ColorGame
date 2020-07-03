
var level = document.getElementById("level")
var colors = generateRandomColors(6)
var h1 = document.querySelector("h1")
var squares = document.querySelectorAll(".square");
var pickedColor = colorPicker()
var displaySelected = document.getElementById("selected")
var selectedColor 
var messageDisplay = document.getElementById("message")
var reset = document.getElementById("reset")

displaySelected.textContent = pickedColor
//loop to add color to all the squares and add event listners
for(var i = 0; i < squares.length; i++) {
    // add initial colors to squares
    squares[i].style.backgroundColor = colors[i]
    // add Event Listeners to all squares
    squares[i].addEventListener("click", function(){
        selectedColor = this.style.backgroundColor
        if( selectedColor === pickedColor){
            messageDisplay.textContent = "Correct!"
            changeColors(selectedColor)
            h1.style.backgroundColor = selectedColor //changing the h1 bckground
        }
        else {
            this.style.backgroundColor = "#1F1E1E";
            messageDisplay.textContent = "Try Again"
        }
    })
}

//function to change all square colors on correct selection
function changeColors(color) {
    //loop through all the squares
    for(var i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = color;
    }
}

//function to pick a random color from colors array
function colorPicker() {
    var random = Math.floor(Math.random() * colors.length);
    return colors[random]
}

//function to generate a random colors array of requested size
function generateRandomColors(n) {
    var arr = []
    for(var i = 0; i < n; i++){
      arr.push(randomColor())  
    }
    return arr;
}

//function to generate random rgb format color
function randomColor() {
    var r = Math.floor(Math.random() * 256)
    var g = Math.floor(Math.random() * 256)
    var b = Math.floor(Math.random() * 256)

    return "rgb(" + r + ", " + g + ", " + b + ")"
}

//reset everthing on reset button click
reset.addEventListener("click", function(){
    //generate new colors
    colors = generateRandomColors(6)
    //pick a new color
    pickedColor = colorPicker()
    //update the picked color in h1
    displaySelected.textContent = pickedColor
    //update all the squares with new colors
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = colors[i]
    }
})


//add level functionality below