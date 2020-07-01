var colors = [
    "rgb(255, 0, 0)",
    "rgb(255, 255, 0)",
    "rgb(255, 0, 255)",
    "rgb(255, 255, 255)",
    "rgb(0, 255, 0)",
    "rgb(0, 0, 255)"
]

var squares = document.querySelectorAll(".square");
var pickedColor = colors[2]
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
        }
        else {
            this.style.backgroundColor = "#1F1E1E";
            messageDisplay.textContent = "Try Again"
        }
    })
}

