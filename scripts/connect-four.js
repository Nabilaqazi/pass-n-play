const rows = 6;
const cols = 7;
let currentPlayer = 'red';
let board = Array.from({ length: rows }, () => Array(cols).fill(null));
let vsAI = confirm("Do you want to play against the AI?");
const gameBoard = document.getElementById('game-board');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');

// Create the game board UI
function createBoard() {
    gameBoard.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => handlePlayerMove(c));
            gameBoard.appendChild(cell);
        }
    }
}

// Handle player move
function handlePlayerMove(col) {
    if (currentPlayer === 'yellow' && vsAI) return; // Prevent human from playing AI's turn

    if (dropPiece(col)) {
        if (checkGameEnd()) return;
        switchTurn();
        if (vsAI && currentPlayer === 'yellow') {
            setTimeout(aiMove, 500);
        }
    }
}

// Drop a piece into the selected column
function dropPiece(col) {
    for (let r = rows - 1; r >= 0; r--) {
        if (!board[r][col]) {
            board[r][col] = currentPlayer;
            updateBoard();
            return true;
        }
    }
    return false; // Column full
}

// AI move (random column selection)
function aiMove() {
    let validColumns = [];
    for (let c = 0; c < cols; c++) {
        if (!board[0][c]) validColumns.push(c);
    }
    if (validColumns.length === 0) return; // No valid moves

    let randomCol = validColumns[Math.floor(Math.random() * validColumns.length)];
    if (dropPiece(randomCol)) {
        if (checkGameEnd()) return;
        switchTurn();
    }
}

// Update UI based on board state
function updateBoard() {
    document.querySelectorAll('.cell').forEach(cell => {
        let r = cell.dataset.row;
        let c = cell.dataset.col;
        cell.className = 'cell';
        if (board[r][c]) {
            cell.classList.add(board[r][c]);
        }
    });
}

// Check if the game has ended
function checkGameEnd() {
    if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer === 'red' ? '1' : '2'} Wins!`;
        disableBoard();
        return true;
    }
    return false;
}

// Check for a winning condition
function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] && (
                checkDirection(r, c, 1, 0) ||  // Vertical
                checkDirection(r, c, 0, 1) ||  // Horizontal
                checkDirection(r, c, 1, 1) ||  // Diagonal /
                checkDirection(r, c, 1, -1)    // Diagonal \
            )) {
                return true;
            }
        }
    }
    return false;
}

// Helper function to check in a direction
function checkDirection(row, col, rowDir, colDir) {
    let count = 0;
    let color = board[row][col];
    for (let i = -3; i <= 3; i++) {
        let r = row + i * rowDir;
        let c = col + i * colDir;
        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === color) {
            count++;
            if (count === 4) return true;
        } else {
            count = 0;
        }
    }
    return false;
}

// Disable further moves when a player wins
function disableBoard() {
    document.querySelectorAll('.cell').forEach(cell => cell.replaceWith(cell.cloneNode(true)));
}

// Switch turns
function switchTurn() {
    currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
    statusText.textContent = `Player ${currentPlayer === 'red' ? '1' : '2'}'s Turn (${currentPlayer})`;
}

// Reset the game
resetButton.addEventListener('click', () => {
    board = Array.from({ length: rows }, () => Array(cols).fill(null));
    currentPlayer = 'red';
    statusText.textContent = "Player 1's Turn (Red)";
    createBoard();
    if (vsAI && currentPlayer === 'yellow') setTimeout(aiMove, 500);
});

// Initialize game
createBoard();
