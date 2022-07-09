/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let Solver;
let SudokuClass;

suite('UnitTests', () => {
  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    return JSDOM.fromFile('./views/index.html')
      .then((dom) => {
        global.window = dom.window;
        global.document = dom.window.document;
      
        Solver = require('../public/sudoku-solver.js');
        SudokuClass = require('../public/sudoku.js');
      }, { runScripts: "dangerously" });
  });
  
  // Only the digits 1-9 are accepted
  // as valid input for the puzzle grid
  suite('Function ____()', () => {
    test('Valid "1-9" characters', (done) => {
      const input = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      
      for(var i = 0; i < input.length; i++) {
        assert.equal(Solver.verifyGrid('A1', input[i]), true);    
      }
      
      done();
    });

    // Invalid characters or numbers are not accepted 
    // as valid input for the puzzle grid
    test('Invalid characters (anything other than "1-9") are not accepted', (done) => {
      const input = ['!', 'a', '/', '+', '-', '0', '10', 0, '.'];
      
      for(var i = 0; i < input.length; i++) {
        assert.equal(Solver.verifyGrid('A1', input[i]), false);    
      }

      done();
    });
  });
  
  suite('Function ____()', () => {
    test('Parses a valid puzzle string into an object', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const textArea = document.getElementById('text-input');
      
      textArea.value = input;
      Solver.updateAllByString(input);
      
      var x, y, value;
      for(var i = 0; i < 81; i++) {
        x = SudokuClass.Sudoku.getX(i);
        y = SudokuClass.Sudoku.getY(i);
        
        value = SudokuClass.Sudoku.sudokuGrid[y][x].toString();
        if(SudokuClass.Sudoku.isEmptyType(value) || !SudokuClass.Sudoku.isNumberType(value)){ value = '.' };
        
        assert.equal(value, input.charAt(i));
      }
      
      done();
    });
    
    // Puzzles that are not 81 numbers/periods long show the message 
    // "Error: Expected puzzle to be 81 characters long." in the
    // `div` with the id "error-msg"
    test('Shows an error for puzzles that are not 81 numbers long', done => {
      const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const longStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
      const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
      const errorDiv = document.getElementById('error-msg');
      const textArea = document.getElementById('text-input');
      
      textArea.value = shortStr;
      Solver.verifyText(textArea);
      assert.equal(errorDiv.innerText, errorMsg);
      
      textArea.value = longStr;
      Solver.verifyText(textArea);
      assert.equal(errorDiv.innerText, errorMsg); 
      
      done();
    });
  });

  suite('Function ____()', () => {
    // Valid complete puzzles pass
    test('Valid puzzles pass', done => {
      const input = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      
      Solver.updateAllByString(input);
      
      var flag = true, x, y;
      for(var i = 0; i < 81; i++) {
        x = SudokuClass.Sudoku.getX(i);
        y = SudokuClass.Sudoku.getY(i);
    
        SudokuClass.Sudoku.sudokuGrid[y][x] = 0;
        
        if(!SudokuClass.possible(x, y, parseInt(input.charAt(i)))) {
          flag = false;
          break;
        }
        
        SudokuClass.Sudoku.sudokuGrid[y][x] = parseInt(input.charAt(i));
      }
      
      assert.equal(flag, true);
      
      done();
    });

    // Invalid complete puzzles fail
    test('Invalid puzzles fail', done => {
      const input = '779235418851496372432178956174569283395842761628713549283657194516924837947381625';

      Solver.updateAllByString(input);
      
      var flag = true, x, y;
      for(var i = 0; i < 81; i++) {
        x = SudokuClass.Sudoku.getX(i);
        y = SudokuClass.Sudoku.getY(i);
    
        SudokuClass.Sudoku.sudokuGrid[y][x] = 0;
        
        if(!SudokuClass.possible(x, y, parseInt(input.charAt(i)))) {
          flag = false;
          break;
        }
        
        SudokuClass.Sudoku.sudokuGrid[y][x] = parseInt(input.charAt(i));
      }
      
      assert.equal(flag, false);
      
      done();
    });
  });
  
  
  suite('Function ____()', () => {
    // Returns the expected solution for a valid, incomplete puzzle
    test('Returns the expected solution for an incomplete puzzle', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const ans = "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
      
      Solver.updateAllByString(input);
      SudokuClass.solve(0, 0, SudokuClass.Sudoku.sudokuGrid);
      
      var x, y, check = '';
      for(var i = 0; i < 81; i++) {
        x = SudokuClass.Sudoku.getX(i);
        y = SudokuClass.Sudoku.getY(i);
        check += SudokuClass.Sudoku.sudokuGrid[y][x];
      }
      
      assert.equal(check, ans);
      
      done();
    });
  });
});
