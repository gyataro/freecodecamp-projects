/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Solver;
let SudokuClass;
let Strings

suite('Functional Tests', () => {
  
  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    return JSDOM.fromFile('./views/index.html')
      .then((dom) => {
        global.window = dom.window;
        global.document = dom.window.document;
      
        Solver = require('../public/sudoku-solver.js');
        SudokuClass = require('../public/sudoku.js');
        Strings = require('../public/strings.js');
      }, { runScripts: "dangerously" });
  });
  
  const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const ans = "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
  
  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates 
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', done => {   
      const textArea = document.getElementById('text-input');
      const evt = document.createEvent("Events");
      const cell = document.getElementById('A1');
      
      textArea.value = input;
      evt.initEvent("change", true, true);
      textArea.dispatchEvent(evt);
      
      assert.equal(textArea.value.charAt(0), '.');
      assert.equal(cell.value, '');
      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', done => {
      const textArea = document.getElementById('text-input');
      const evt = document.createEvent("Events");
      const cell = document.getElementById('A3');
      
      cell.value = '9';
      evt.initEvent("change", true, true);
      cell.dispatchEvent(evt);
  
      assert.equal(textArea.value.charAt(2), '9');
      assert.equal(cell.value, '9');
      done();      
    });
  });
  
  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku 
    // grid and the text area
    test('Function clearInput()', done => {   
      const textArea = document.getElementById('text-input');
      
      textArea.value = input;
      Solver.updateAllByString(textArea.value);
      
      textArea.value = '';
      Solver.updateAllByString('');
      
      var isGridEmpty = true;
      for(var i = 0; i < 81; i++) {
        var cell = SudokuClass.Sudoku.indexToCoor(i).toString();
        if(document.getElementById(cell).value != '') {
          isGridEmpty = false;
          break;
        }
      }
      
      assert.equal(textArea.value, '');
      assert.equal(isGridEmpty, true);
      done();
    });
    
    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function showSolution(solve(input))', done => {
      const textArea = document.getElementById('text-input');
      
      Solver.updateAllByString(input);
      SudokuClass.solve(0, 0, SudokuClass.Sudoku.sudokuGrid);
      
      var x, y, check = '';
      for(var i = 0; i < 81; i++) {
        x = SudokuClass.Sudoku.getX(i);
        y = SudokuClass.Sudoku.getY(i);
        check += SudokuClass.Sudoku.sudokuGrid[y][x];
      }
      Solver.updateAllByString(check);
      
      var isGridCorrect = true;
      for(var i = 0; i < 81; i++) {
        var cell = SudokuClass.Sudoku.indexToCoor(i).toString();
        if(document.getElementById(cell).value != ans.charAt(i)) {
          isGridCorrect = false;
          break;
        }
      }
      
      assert.equal(check, ans);
      assert.equal(isGridCorrect, true);
      done();
    });
  });
});
