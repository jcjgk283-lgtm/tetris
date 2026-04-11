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
  [[1,1,0],[0,1,1]], // S
  [[0,1,1],[1,1,0]], // Z
  [[1,0,0],[1,1,1]], // J
  [[0,0,1],[1,1,1]]  // L
];

let piece, x, y;

// 🎯 新方块
function newPiece() {
  piece = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  x = Math.floor(COLS / 2) - 1;
  y = 0;
}

// 🎯 旋转
function rotate() {
  let newPiece = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
  if (!collision(newPiece, x, y)) {
    piece = newPiece;
  }
}

// 🎯 碰撞检测（核心修复）
function collision(p, px, py) {
  for (let r = 0; r < p.length; r++) {
    for (let c = 0; c < p[r].length; c++) {
      if (p[r][c]) {
        let nx = px + c;
        let ny = py + r;

        if (
          nx < 0 ||
          nx >= COLS ||
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

// 🎯 固定方块
function merge() {
  piece.forEach((row, r) => {
    row.forEach((v, c) => {
      if (v) {
        board[y + r][x + c] = 1;
      }
    });
  });
}

// 🎯 消行
function clearLines() {
  board = board.filter(row => row.some(v => v === 0));
  while (board.length < ROWS) {
    board.unshift(Array(COLS).fill(0));
  }
}

// 🎯 下落（核心修复）
function drop() {
  if (!collision(piece, x, y + 1)) {
    y++;
  } else {
    merge();
    clearLines();
    newPiece();
  }
}

// 🎯 左右移动
function move(dir) {
  if (!collision(piece, x + dir, y)) {
    x += dir;
  }
}

// 🎯 绘制
function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 画已固定
  board.forEach((row, r) => {
    row.forEach((v, c) => {
      if (v) {
        ctx.fillStyle = "cyan";
        ctx.fillRect(c * SIZE, r * SIZE, SIZE - 1, SIZE - 1);
      }
    });
  });

  // 画当前方块
  piece.forEach((row, r) => {
    row.forEach((v, c) => {
      if (v) {
        ctx.fillStyle = "orange";
        ctx.fillRect((x + c) * SIZE, (y + r) * SIZE, SIZE - 1, SIZE - 1);
      }
    });
  });
}

// 🎯 游戏循环（稳定速度）
function update() {
  drop();
  draw();
}

newPiece();
setInterval(update, 500); // 👈 调慢速度（关键！）