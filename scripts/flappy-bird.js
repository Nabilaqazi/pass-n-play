const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

// Set canvas size
canvas.width = 400;
canvas.height = 500;

// Load Bird Image
const birdImg = new Image();
birdImg.src = "../assets/images/bird.jpg"; // Change this to your actual bird image path

// Game Variables
let bird, pipes, frame, gameOver, gameStarted;

// Function to Initialize Game Variables
function initGame() {
    bird = { x: 50, y: 200, width: 30, height: 30, velocity: 0, gravity: 0.4, lift: -8 };
    pipes = [];
    frame = 0;
    gameOver = false;
    gameStarted = false;

    startBtn.style.display = "block"; // Show start button initially
    resetBtn.style.display = "none"; // Hide reset button
    draw(); // Draw initial game state
}

// Function to Start the Game
function startGame() {
    gameStarted = true;
    startBtn.style.display = "none"; // Hide start button
    gameLoop();
}

// Function to Handle Bird Jump
document.addEventListener("keydown", () => {
    if (gameStarted && !gameOver) {
        bird.velocity = bird.lift;
    }
});

// Function to Update Game State
function update() {
    if (!gameStarted || gameOver) return;

    // Bird Movement
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Prevent Bird from falling off
    if (bird.y >= canvas.height || bird.y <= 0) {
        gameOver = true;
    }

    // Spawn Pipes
    if (frame % 100 === 0) {
        let pipeHeight = Math.random() * (canvas.height / 2);
        pipes.push({ x: canvas.width, y: pipeHeight });
    }

    // Move Pipes & Check Collision
    pipes.forEach(pipe => {
        pipe.x -= 3;

        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + 50 &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + 100)
        ) {
            gameOver = true;
        }
    });

    // Remove pipes that move out of canvas
    pipes = pipes.filter(pipe => pipe.x > -50);

    if (gameOver) {
        resetBtn.style.display = "block"; // Show reset button when game over
    }

    frame++;
}

// Function to Draw Everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Bird
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Draw Pipes
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, 50, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + 100, 50, canvas.height - pipe.y);
    });

    // Game Over Text
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", 120, 250);
    }
}

// Game Loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Function to Reset Game
function resetGame() {
    initGame();
}

// Initialize Game
initGame();
