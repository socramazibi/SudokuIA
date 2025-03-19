import { generateSudoku } from './sudokuGenerator.js';
import { solveSudoku } from './sudokuSolver.js';
import { isValidMove, checkSolution } from './validator.js';

let board = [];
let solution = [];
let selectedCell = null;
let points = 0;

const difficulties = {
  easy: 40,
  medium: 50,
  hard: 60
};

function initializeGame() {
  const difficulty = document.getElementById('difficulty').value;
  const emptyCells = difficulties[difficulty];
  const result = generateSudoku(emptyCells);
  board = result.puzzle;
  solution = result.solution;
  points = 100;
  updatePointsDisplay();
  renderBoard();
  document.getElementById('message').textContent = '';
}

function updatePointsDisplay() {
  document.getElementById('points').textContent = `Puntos: ${points}`;
}

function renderBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (board[i][j] !== 0) {
        cell.textContent = board[i][j];
        cell.classList.add('fixed');
      }
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', selectCell);
      boardElement.appendChild(cell);
    }
  }
}

function selectCell(e) {
  if (e.target.classList.contains('fixed')) return;
  
  // Remove previous selection
  const prevSelected = document.querySelector('.cell.selected');
  if (prevSelected) prevSelected.classList.remove('selected');
  
  // Add new selection
  e.target.classList.add('selected');
  selectedCell = e.target;
}

function handleNumInput(num) {
  if (!selectedCell) return;
  
  const row = parseInt(selectedCell.dataset.row);
  const col = parseInt(selectedCell.dataset.col);
  
  if (num === 0) {
    board[row][col] = 0;
    selectedCell.textContent = '';
    selectedCell.classList.remove('invalid');
    return;
  }
  
  if (!isValidMove(board, row, col, num)) {
    selectedCell.classList.add('invalid');
  } else {
    selectedCell.classList.remove('invalid');
  }
  
  board[row][col] = num;
  selectedCell.textContent = num;
}

function checkCurrentSolution() {
  const message = document.getElementById('message');
  if (checkSolution(board)) {
    message.textContent = '¡Felicitaciones! ¡Has resuelto el puzzle!';
    message.className = 'success';
    // Only award points if they haven't been depleted
    if (points > 0) {
      const finalPoints = points;
      message.textContent += ` ¡Has ganado ${finalPoints} puntos!`;
    }
  } else {
    message.textContent = 'No está correcto, ¡sigue intentando!';
    message.className = 'error';
  }
}

function getHint() {
  if (points < 10) {
    document.getElementById('message').textContent = 'No tienes suficientes puntos para una pista';
    return;
  }
  
  // Find a random empty cell
  let emptyCells = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }
  
  if (emptyCells.length === 0) {
    document.getElementById('message').textContent = 'No hay celdas vacías para dar pista';
    return;
  }
  
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[row][col] = solution[row][col];
  points -= 10;
  updatePointsDisplay();
  renderBoard();
  
  document.getElementById('message').textContent = '¡Pista revelada! (-10 puntos)';
}

function solvePuzzle() {
  // Deduct 50 points if player has any points
  if (points > 0) {
    points = Math.max(0, points - 50);
    updatePointsDisplay();
    document.getElementById('message').textContent = 'Se han descontado 50 puntos por usar el solucionador';
  }

  const solvedBoard = solveSudoku([...board.map(row => [...row])]);
  if (solvedBoard) {
    board = solvedBoard;
    renderBoard();
    if (points === 0) {
      document.getElementById('message').textContent = '¡Puzzle resuelto! No has ganado puntos por usar el solucionador';
    }
  } else {
    document.getElementById('message').textContent = '¡No existe solución!';
  }
}

function generateNewPuzzle() {
  const difficulty = document.getElementById('difficulty').value;
  const emptyCells = difficulties[difficulty];
  const result = generateSudoku(emptyCells);
  board = result.puzzle;
  solution = result.solution;
  renderBoard();
  document.getElementById('message').textContent = '';
}

// Event Listeners
document.getElementById('newGame').addEventListener('click', initializeGame);
document.getElementById('newPuzzle').addEventListener('click', generateNewPuzzle);
document.getElementById('check').addEventListener('click', checkCurrentSolution);
document.getElementById('solve').addEventListener('click', solvePuzzle);
document.getElementById('hint').addEventListener('click', getHint);

document.querySelectorAll('.num-btn').forEach(button => {
  button.addEventListener('click', () => {
    handleNumInput(parseInt(button.dataset.num));
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (selectedCell && e.key >= '0' && e.key <= '9') {
    handleNumInput(parseInt(e.key));
  }
});

// Initialize game on load
initializeGame();