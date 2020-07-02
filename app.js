var colors = [
    "rgb(255, 0, 0)",
    "rgb(255, 255, 0)",
    "rgb(255, 0, 255)",
    "rgb(255, 255, 255)",
    "rgb(0, 255, 0)",
    "rgb(0, 0, 255)"
]

var squares = document.querySelectorAll(".square");
var pickedColor = colorPicker()
var displaySelected = document.getElementById("selected")
var selectedColor 
var messageDisplay = document.getElementById("message")

displaySelected.textContent = pickedColor

for(var i = 0; i < squares.length; i++) {
    // add initial colors to squares
    squares[i].style.backgroundColor = colors[i]
    // add Event Listeners to all squares
    squares[i].addEventListener("click", function(){
        selectedColor = this.style.backgroundColor
        if( selectedColor === pickedColor){
            messageDisplay.textContent = "Correct!"
            changeColors(selectedColor)
        }
        else {
            this.style.backgroundColor = "#1F1E1E";
            messageDisplay.textContent = "Try Again"
        }
    })
}

//function to change all square colors on correct selection
function changeColors(color) {
    //first loop through all the squares
    for(var i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = color;
    }
}

//function to pick a random color from colors array
function colorPicker() {
    var randomColor = Math.floor(Math.random() * colors.length);
    return colors[randomColor]
}