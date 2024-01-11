const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImage = new Image();
birdImage.src = "bird.png";

const pipeImage = new Image();
pipeImage.src = "pipe.png";

const backgroundImage = new Image();
backgroundImage.src = "background.jpg";

const bird = {
    x: 100,
    y: canvas.height / 2 - 15,
    width: 40,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jump: -10,
};

const pipes = [];
const pipeWidth = 80;
const pipeGap = 150;
const pipeSpeed = 5;

let score = 0;
let gameStarted = false;

function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipeX, openingY) {
    ctx.drawImage(pipeImage, pipeX, 0, pipeWidth, openingY);
    ctx.drawImage(pipeImage, pipeX, openingY + pipeGap, pipeWidth, canvas.height - openingY - pipeGap);
}

function drawScore() {
    ctx.fillStyle = "#008000";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, canvas.width - 150, 50);
}

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function update() {
    if (!gameStarted) {
        return;
    }

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.height || bird.y < 0) {
        endGame();
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x <= canvas.width - 300) {
        const openingY = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({ x: canvas.width, openingY });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        if (
            bird.x + bird.width > pipes[i].x &&
            bird.x < pipes[i].x + pipeWidth &&
            (bird.y < pipes[i].openingY || bird.y + bird.height > pipes[i].openingY + pipeGap)
        ) {
            endGame();
        }

        if (pipes[i].x + pipeWidth < bird.x && !pipes[i].scored) {
            pipes[i].scored = true;
            score++;
        }

        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }
}

function draw() {
    drawBackground();

    for (const pipe of pipes) {
        drawPipe(pipe.x, pipe.openingY);
    }

    drawBird();
    drawScore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    bird.y = canvas.height / 2 - 15;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameStarted = false;
    document.getElementById("startButton").style.display = "block";
    document.getElementById("retryButton").style.display = "none";
    document.getElementById("gameOverPopup").style.display = "none";
}

function endGame() {
    document.getElementById("retryButton").style.display = "block";
    document.getElementById("finalScore").textContent = "Final Score: " + score;
    document.getElementById("gameOverPopup").style.display = "block";
}

function startGame() {
    document.getElementById("gameButtons").style.display = "none";
    document.getElementById("retryButton").style.display = "none";
    gameStarted = true;
}

function retryGame() {
    document.getElementById("gameOverPopup").style.display = "none";
    resetGame();
    startGame();
}

document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && gameStarted) {
        bird.velocity = bird.jump;
    }
});

gameLoop();
