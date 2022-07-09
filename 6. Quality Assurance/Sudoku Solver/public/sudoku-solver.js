import { puzzlesCount, puzzlesAndSolutions } from './puzzle-strings.js';
import { Strings } from './strings.js';
import { Sudoku, solve, possible } from './sudoku.js';

const sudokuArea = document.getElementById('sudoku-grid');
const textArea = document.getElementById('text-input');
const solveButton = document.getElementById('solve-button');
const clearButton = document.getElementById('clear-button');
const errorMsg = document.getElementById('error-msg');

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

document.addEventListener('DOMContentLoaded', () => {
  
  // Load a simple puzzle into the text area & grid
  initialize(textArea);
  
  // Detect and sanitize user input (textArea)
  textArea.addEventListener("change", (event) => {
    if(verifyText(textArea)) updateAllByString(textArea.value);
  });
  
  // Detect and sanitize user input (sudoku grid)
  sudokuArea.addEventListener('change', (event) => {
    var input = event.target;
    
    if(input && input.className == "sudoku-input") {
      
      var i, x, y;
      if(verifyGrid(input.id, input.value)) {
        i = Sudoku.coorToIndex(input.id);
        x = Sudoku.getX(i);
        y = Sudoku.getY(i);
        
        Sudoku.update(x, y, input.value);
        updateText(textArea, i, input.value);
      }
    }
  });
  
  // Solve sudoku with recursive, backtracking algorithm
  solveButton.addEventListener('click', (event) => {
    try {
      solve(0, 0, Sudoku.sudokuGrid);
    } catch(e){}
    
    var x, y, value;
    textArea.value = Strings.empty;
    for(var i = 0; i < Sudoku.cellCount; i++) {
        x = Sudoku.getX(i);
        y = Sudoku.getY(i);
        value = Sudoku.sudokuGrid[y][x];
      
        updateGrid(sudokuArea, Sudoku.indexToCoor(i), value);
        textArea.value += value;
    }
  });
  
  // Clear input
  clearButton.addEventListener('click', reset);
  
});

function initialize(textArea) {
  var index = Math.floor(Math.random() * (puzzlesCount - 0) + 0);
  textArea.value = puzzlesAndSolutions[index][0];
  updateAllByString(textArea.value);
}

function reset() {
  textArea.value = Strings.empty;
  updateAllByString(Strings.empty);
}

function verifyText(textArea) {
  if(textArea.value.length != Sudoku.cellCount) {
    errorMsg.innerText = Strings.wrongLength;
    return false;
  } else if(!/^[1-9.]+$/.test(textArea.value)) {
    errorMsg.innerText = Strings.wrongChar;
    return false;
  } else {
    errorMsg.innerText = Strings.empty;
    return true;
  }
}

function verifyGrid(coor, value) {
  var index = Sudoku.coorToIndex(coor);
  
  return (index > -1 && (Sudoku.isEmptyType(value) || Sudoku.isNumberType(value)));
}

// Update text via grid input
function updateText(textArea, index, value) {
  if(Sudoku.isEmptyType(value)) value = '.';
  textArea.value = textArea.value.replaceAt(index, value);
}

// Update grid via text
function updateGrid(sudokuArea, coor, value) {
  var sudokuCell = document.getElementById(coor.toString());
  if(Sudoku.isEmptyType(value) || value == '') value = '';
  
  if(sudokuCell) {  
    sudokuCell.value = value;
  }
}

// Update whole grid & sudoku array
function updateAllByString(string) {
    var len = string.length;
  
    var x, y, value;
    for(var i = 0; i < Sudoku.cellCount; i++) {
        x = Sudoku.getX(i);
        y = Sudoku.getY(i);
      
        value = (len == 0)? 0 : string.charAt(i);
        Sudoku.update(x, y, value);
        updateGrid(sudokuArea, Sudoku.indexToCoor(i), value);
    }
}

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    initialize,
    reset,
    verifyText,
    verifyGrid,
    updateText,
    updateGrid,
    updateAllByString
  }
} catch (e) {}
