let board, currentTurn, player1, player2, isAI, timer, timeLeft, selectedPiece = null;
let chessBoard = [
    ["♜","♞","♝","♛","♚","♝","♞","♜"],
    ["♟","♟","♟","♟","♟","♟","♟","♟"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["♙","♙","♙","♙","♙","♙","♙","♙"],
    ["♖","♘","♗","♕","♔","♗","♘","♖"]
];

function startGame() {
    player1 = document.getElementById("player1").value || "Player 1";
    player2 = document.getElementById("player2").value || "Player 2";
    isAI = player2.toLowerCase() === "ai";
    currentTurn = "white";

    document.getElementById("game-setup").style.display = "none";
    document.getElementById("chess-container").style.display = "block";
    document.getElementById("turn-indicator").innerText = `${player1}'s Turn (White)`;

    drawBoard();
    resetTimer();
}

function drawBoard() {
    board = document.getElementById("chessboard");
    board.innerHTML = "";
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let square = document.createElement("div");
            square.classList.add("square", (row + col) % 2 === 0 ? "white" : "black");
            square.dataset.row = row;
            square.dataset.col = col;

            if (chessBoard[row][col] !== "") {
                let piece = document.createElement("span");
                piece.innerText = chessBoard[row][col];
                piece.classList.add("piece");
                square.appendChild(piece);
            }

            square.addEventListener("click", () => handleMove(row, col));
            board.appendChild(square);
        }
    }
}

function handleMove(row, col) {
    if (selectedPiece) {
        makeMove(selectedPiece.row, selectedPiece.col, row, col);
        selectedPiece = null;
        document.querySelectorAll(".highlight").forEach(cell => cell.classList.remove("highlight"));
    } else {
        if (chessBoard[row][col] && isCorrectTurn(chessBoard[row][col])) {
            selectedPiece = { row, col };
            highlightMoves(row, col);
        }
    }
}

function isCorrectTurn(piece) {
    return (currentTurn === "white" && "♙♖♘♗♕♔".includes(piece)) ||
           (currentTurn === "black" && "♟♜♞♝♛♚".includes(piece));
}

function highlightMoves(row, col) {
    document.querySelectorAll(".highlight").forEach(cell => cell.classList.remove("highlight"));
    
    let moves = getValidMoves(row, col);
    moves.forEach(([r, c]) => {
        let square = document.querySelector(`.square[data-row='${r}'][data-col='${c}']`);
        square.classList.add("highlight");
    });
}

function getValidMoves(row, col) {
    let piece = chessBoard[row][col];
    let moves = [];

    if (piece === "♙" && row > 0 && chessBoard[row - 1][col] === "") moves.push([row - 1, col]);
    if (piece === "♟" && row < 7 && chessBoard[row + 1][col] === "") moves.push([row + 1, col]);

    return moves;
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    chessBoard[toRow][toCol] = chessBoard[fromRow][fromCol];
    chessBoard[fromRow][fromCol] = "";
    currentTurn = currentTurn === "white" ? "black" : "white";
    
    document.getElementById("turn-indicator").innerText =
        `${currentTurn === "white" ? player1 : player2}'s Turn (${currentTurn})`;

    drawBoard();
    resetTimer();

    if (isAI && currentTurn === "black") setTimeout(aiMove, 1000);
}

function aiMove() {
    let availableMoves = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (!isCorrectTurn(chessBoard[row][col])) {
                let moves = getValidMoves(row, col);
                moves.forEach(move => availableMoves.push([row, col, move[0], move[1]]));
            }
        }
    }
    
    if (availableMoves.length > 0) {
        let [fr, fc, tr, tc] = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        makeMove(fr, fc, tr, tc);
    }
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById("time-left").innerText = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").innerText = timeLeft;
        if (timeLeft === 0) switchTurn();
    }, 1000);
}

function switchTurn() {
    selectedPiece = null;
    currentTurn = currentTurn === "white" ? "black" : "white";
    drawBoard();
    resetTimer();
}
