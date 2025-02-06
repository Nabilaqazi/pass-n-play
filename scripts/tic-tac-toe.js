let board = Array(9).fill(null);
let currentPlayer = 'X';
let player1 = '';
let player2 = '';
let isSinglePlayer = false;

// Function to start the game
function startGame() {
    player1 = document.getElementById('player1').value || 'Player 1';
    player2 = document.getElementById('player2').value || 'Computer';

    isSinglePlayer = player2 === 'Computer';
    document.getElementById('player-form').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    document.getElementById('turn-indicator').innerText = `${player1}'s Turn (X)`;
    renderBoard();
}

// Function to render the Tic Tac Toe board
function renderBoard() {
    const boardContainer = document.getElementById('game-board');
    boardContainer.innerHTML = '';

    board.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.innerText = cell || '';
        cellDiv.onclick = () => makeMove(index);
        if (cell) cellDiv.classList.add('taken');
        boardContainer.appendChild(cellDiv);
    });
}

// Function to handle a move
function makeMove(index) {
    if (board[index]) return; // Cell already taken

    board[index] = currentPlayer;
    const result = checkWinner();

    if (result) {
        drawWinningLine(result.combo);
        setTimeout(() => {
            alert(`${result.winner} wins!`);
            resetGame();
        }, 1000);
        return;
    }

    if (board.every(cell => cell)) {
        alert("It's a draw!");
        resetGame();
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('turn-indicator').innerText =
        `${currentPlayer === 'X' ? player1 : player2}'s Turn (${currentPlayer})`;

    // AI Move for single-player mode
    if (isSinglePlayer && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }

    renderBoard();
}

// Function for AI to make a move
function makeAIMove() {
    const emptyIndices = board.map((cell, index) => (cell ? null : index)).filter(index => index !== null);
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    makeMove(randomIndex);
}

// Function to check the winner
function checkWinner() {
    
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
    
        for (let combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return { winner: currentPlayer === 'X' ? player1 : player2, combo };
            }
        }
        return null;
    }
    

// Function to reset the game
function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    document.getElementById('player-form').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
    renderBoard();
}
function drawWinningLine(combo) {
    const boardContainer = document.getElementById('game-board');
    const line = document.createElement('div');
    line.classList.add('winning-line');

    const [a, b, c] = combo;
    const cells = document.querySelectorAll('.cell');

    // Get positions of the winning cells
    const firstCell = cells[a].getBoundingClientRect();
    const lastCell = cells[c].getBoundingClientRect();
    const boardRect = boardContainer.getBoundingClientRect();

    // Calculate position for the line
    const centerX1 = firstCell.left + firstCell.width / 2 - boardRect.left;
    const centerY1 = firstCell.top + firstCell.height / 2 - boardRect.top;
    const centerX2 = lastCell.left + lastCell.width / 2 - boardRect.left;
    const centerY2 = lastCell.top + lastCell.height / 2 - boardRect.top;

    // Calculate rotation angle
    const deltaX = centerX2 - centerX1;
    const deltaY = centerY2 - centerY1;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${Math.atan2(deltaY, deltaX)}rad)`;
    line.style.top = `${centerY1}px`;
    line.style.left = `${centerX1}px`;

    boardContainer.appendChild(line);
}
