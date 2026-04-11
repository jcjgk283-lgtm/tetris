const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const COLS = 10;
const ROWS = 20;
const SIZE = 30;

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const SHAPES = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1]], // T
  [[1,0,0],[1,1,1]], // L
  [[0,0,1],[1,1,1]], // J
];

let piece = null;
let x = 3;
let y = 0;

function newPiece() {
  piece = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  x = 3;
  y = 0;

  if (collide()) {
    alert("游戏结束");
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }
}

function collide() {
  for (let r = 0; r < piece.length; r++) {
    for (let c = 0; c < piece[r].length; c++) {
      if (piece[r][c]) {
        let nx = x + c;
        let ny = y + r;

        if (
          nx < 0 || nx >= COLS ||
          ny >= ROWS ||
          (ny >= 0 && board[ny][nx])
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function merge() {
  for (let r = 0; r < piece.length; r++) {
    for (let c = 0; c < piece[r].length; c++) {
      if (piece[r][c]) {
        board[y + r][x + c] = 1;
      }
    }
  }
}

function clearLines() {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(v => v === 1)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(0));
      r++;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 画已固定
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        ctx.fillStyle = "#0ff";
        ctx.fillRect(c * SIZE, r * SIZE, SIZE, SIZE);
      }
    }
  }

  // 画当前方块
  ctx.fillStyle = "#f90";
  piece.forEach((row, r) => {
    row.forEach((v, c) => {
      if (v) {
        ctx.fillRect((x + c) * SIZE, (y + r) * SIZE, SIZE, SIZE);
      }
    });
  });
}

function drop() {
  y++;
  if (collide()) {
    y--;
    merge();
    clearLines();
    newPiece();
  }
}

function move(dir) {
  x += dir;
  if (collide()) x -= dir;
}

function rotate() {
  let rotated = piece[0].map((_, i) =>
    piece.map(row => row[i]).reverse()
  );

  let old = piece;
  piece = rotated;
  if (collide()) piece = old;
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") move(-1);
  if (e.key === "ArrowRight") move(1);
  if (e.key === "ArrowDown") drop();
  if (e.key === "ArrowUp") rotate();
});

setInterval(() => {
  drop();
  draw();
}, 500);

newPiece();
draw();