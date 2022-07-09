const Sudoku = {
  cellCount: 81,
  gridSize: 9,
  boxSize: 3,
  
  sudokuId: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9",
              "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9",
              "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9",
              "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9",
              "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9",
              "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9",
              "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9",
              "H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9",
              "I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8", "I9"],
  
  sudokuGrid: [[],[],[],[],[],[],[],[],[]],
  
  update(x, y, value) {
    this.sudokuGrid[y][x] = isNaN(value)? 0 : parseInt(value, 10);
  },
  
  coorToIndex(coor) {
    return this.sudokuId.indexOf(coor);
  },
  
  indexToCoor(index) {
    if(index >= 0 && index <= 80) {
        return this.sudokuId[index];
    }
  },
  
  getX(index) {
    return parseInt(index, 10) % 9;
  },
  
  getY(index) {
    return Math.floor(parseInt(index, 10) / 9);
  },
  
  isEmptyType(cell) {
    cell = cell.toString();
    if(['', ' '].includes(cell)) return true;
    else return false;
  },
  
  isNumberType(cell) {
    var x = parseInt(cell, 10);
    return  (!isNaN(x) && x > 0 && x < 10);
  }
}


function possible(x, y, value) {
    //Check row
    for(var i = 0; i < 9; i++) {
      if(Sudoku.sudokuGrid[y][i] === value){ return false };
    }
    
    //Check column
    for(var i = 0; i < 9; i++) {
      if(Sudoku.sudokuGrid[i][x] === value){ return false };
    }
    
    var x0 = Math.floor(x/3)*3;
    var y0 = Math.floor(y/3)*3;
    
    //Check box
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        if(Sudoku.sudokuGrid[y0 + i][x0 + j] == value){ return false };
      }
    }
    
    return true;
}

function solve(i, j, array) {
  var x = 0;
  var y = 0;
  var n = 0;
  var backtrack = false;

  for(y = j; y < 9; ++y) { 
    for(x = i; x < 9; ++x) {
      if(array[y][x] == 0) {
        for(n = 1; n <= 9; ++n) {
          if(possible(x, y, n)) {
            array[y][x] = n;
            backtrack = solve(i, j, array);
            if(backtrack) { 
              array[y][x] = 0;
            } else {
              return false;
            }
          }  
        }
        return true;
      }
    }
  }
  return false;
}

export { Sudoku, solve, possible }