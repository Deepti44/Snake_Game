const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

const box = 20;
let score = 0;
let direction;
let isPaused = false;
let game;

// Initial snake
let snake = [
  { x: 10 * box, y: 10 * box }
];

// Initial food
let food = {
  x: Math.floor(Math.random() * 19 + 1) * box,
  y: Math.floor(Math.random() * 19 + 1) * box
};

// Controls
document.addEventListener("keydown", setDirection);

function setDirection(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function drawGame() {
  if (isPaused) return;

  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "darkgreen" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Move the snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  else if (direction === "RIGHT") headX += box;
  else if (direction === "UP") headY -= box;
  else if (direction === "DOWN") headY += box;

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box
    };
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  // Collision detection
  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    document.getElementById("finalScore").textContent = "Your Score: " + score;
    document.getElementById("gameOverScreen").style.display = "block";
    canvas.style.display = "none";
    document.getElementById("pauseBtn").style.display = "none";
    return;
  }

  snake.unshift(newHead);

  // Draw score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function collision(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x === arr[i].x && head.y === arr[i].y) {
      return true;
    }
  }
  return false;
}

// Pause / Resume function
function togglePause() {
  if (!isPaused) {
    clearInterval(game);
    isPaused = true;
    document.getElementById("pauseBtn").innerText = "Resume";
  } else {
    game = setInterval(drawGame, 150);
    isPaused = false;
    document.getElementById("pauseBtn").innerText = "Pause";
  }
}

// Restart game function
function restartGame() {
  // Reset everything
  snake = [{ x: 10 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
  };
  isPaused = false;

  // Hide game over screen
  document.getElementById("gameOverScreen").style.display = "none";
  canvas.style.display = "block";
  document.getElementById("pauseBtn").style.display = "inline-block";
  document.getElementById("pauseBtn").innerText = "Pause";

  // Start game loop again
  clearInterval(game);
  game = setInterval(drawGame, 150);
}

// Start the game initially
game = setInterval(drawGame, 150);
