// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
const bird = {
  x: 50,
  y: 150,
  width: 20,
  height: 20,
  gravity: 0.6,
  velocity: 0,
  jump: -10
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 120;
let pipeDelay = 100;
let score = 0;

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height >= canvas.height) {
    bird.y = canvas.height - bird.height;
    bird.velocity = 0;
    // Reset game logic (optional)
  }
}

function jump() {
  bird.velocity = bird.jump;
}

function createPipes() {
  if (pipeDelay === 0) {
    const pipeHeight = Math.random() * (canvas.height - pipeGap);
    pipes.push({
      x: canvas.width,
      top: pipeHeight,
      bottom: pipeHeight + pipeGap
    });
    pipeDelay = 100; // Delay before creating next pipe
  } else {
    pipeDelay--;
  }
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
  });
}

function updatePipes() {
  pipes.forEach((pipe, index) => {
    pipe.x -= 2;

    if (pipe.x + pipeWidth <= 0) {
      pipes.splice(index, 1);
      score++;
    }

    // Check collision
    if (bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)) {
      resetGame();
    }
  });
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 25);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  updateBird();

  createPipes();
  drawPipes();
  updatePipes();

  drawScore();

  requestAnimationFrame(gameLoop);
}

// Event listener for jumping
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

// Start the game
gameLoop();
