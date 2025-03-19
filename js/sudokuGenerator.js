function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createEmptyBoard() {
  return Array(9).fill().map(() => Array(9).fill(0));
}

function isValid(board, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }
  
  // Check 3x3 box
  let startRow = row - row % 3;
  let startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }
  
  return true;
}

function fillBoard(board) {
  let row = -1;
  let col = -1;
  let isEmpty = false;
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }
  
  if (!isEmpty) return true;
  
  const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (let num of nums) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (fillBoard(board)) return true;
      board[row][col] = 0;
    }
  }
  
  return false;
}

export function generateSudoku(emptyCells) {
  const board = createEmptyBoard();
  fillBoard(board);
  
  // Create a copy of the solution
  const solution = board.map(row => [...row]);
  
  // Remove numbers to create the puzzle
  let cellsToRemove = emptyCells;
  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      cellsToRemove--;
    }
  }
  
  return { puzzle: board, solution };
}