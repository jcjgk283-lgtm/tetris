const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ROW = 20;
const COL = 10;
const SIZE = 30;

let board = Array.from({ length: ROW }, () => Array(COL).fill(0));

const SHAPES = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1]],
    [[1,1,0],[0,1,1]],
    [[0,1,1],[1,1,0]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]]
];

let piece, x, y;
let score = 0;

// ⭐ 控制速度（关键）
let dropInterval = 600; // 毫秒（越大越慢）
let lastTime = 0;

function newPiece() {
    piece = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    x = 3;
    y = 0;
}

function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 已固定方块
    board.forEach((row, r) => {
        row.forEach((v, c) => {
            if (v) drawCell(c, r, "#0ff");
        });
    });

    // 当前方块
    piece.forEach((row, i) => {
        row.forEach((v, j) => {
            if (v) drawCell(x + j, y + i, "orange");
        });
    });
}

function collide(nx, ny, p = piece) {
    for (let i = 0; i < p.length; i++) {
        for (let j = 0; j < p[i].length; j++) {
            if (p[i][j]) {
                let newX = nx + j;
                let newY = ny + i;

                if (newX < 0 || newX >= COL || newY >= ROW) return true;
                if (board[newY] && board[newY][newX]) return true;
            }
        }
    }
    return false;
}

function merge() {
    piece.forEach((row, i) => {
        row.forEach((v, j) => {
            if (v) board[y + i][x + j] = 1;
        });
    });
}

function clearLines() {
    board = board.filter(row => row.some(v => !v));

    while (board.length < ROW) {
        board.unshift(Array(COL).fill(0));
        score += 10;
    }

    document.getElementById("score").innerText = score;
}

function rotate() {
    let newPiece = piece[0].map((_, i) =>
        piece.map(row => row[i]).reverse()
    );

    if (!collide(x, y, newPiece)) piece = newPiece;
}

function move(dir) {
    if (!collide(x + dir, y)) x += dir;
}

// ⭐ 修复核心：不会疯狂下落
function drop() {
    if (!collide(x, y + 1)) {
        y++;
    } else {
        merge();
        clearLines();
        newPiece();

        // 游戏结束检测
        if (collide(x, y)) {
            alert("游戏结束！");
            board = Array.from({ length: ROW }, () => Array(COL).fill(0));
            score = 0;
        }
    }
}

// ⭐ 正确游戏循环（关键修复）
function loop(time = 0) {
    if (time - lastTime > dropInterval) {
        drop();
        lastTime = time;
    }

    draw();
    requestAnimationFrame(loop);
}

// 控制
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
    if (e.key === "ArrowUp") rotate();
    if (e.key === "ArrowDown") drop();
});

// 手机点击播放音乐（防止被浏览器拦）
document.body.addEventListener("click", () => {
    const bgm = document.getElementById("bgm");
    if (bgm) bgm.play();
}, { once: true });

// 初始化
newPiece();
loop();