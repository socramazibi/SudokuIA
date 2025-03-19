export function isValidMove(board, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if ((startRow + i !== row || startCol + j !== col) && 
          board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  
  return true;
}

export function checkSolution(board) {
  // Check if board is completely filled
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) return false;
    }
  }
  
  // Check each row
  for (let row = 0; row < 9; row++) {
    const nums = new Set();
    for (let col = 0; col < 9; col++) {
      nums.add(board[row][col]);
    }
    if (nums.size !== 9) return false;
  }
  
  // Check each column
  for (let col = 0; col < 9; col++) {
    const nums = new Set();
    for (let row = 0; row < 9; row++) {
      nums.add(board[row][col]);
    }
    if (nums.size !== 9) return false;
  }
  
  // Check each 3x3 box
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const nums = new Set();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          nums.add(board[boxRow * 3 + i][boxCol * 3 + j]);
        }
      }
      if (nums.size !== 9) return false;
    }
  }
  
  return true;
}