const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const COL = 10;
const ROW = 20;
const SIZE = 30;

// 🎯 状态
let board = Array.from({ length: ROW }, () => Array(COL).fill(0));
let score = 0;
let dropSpeed = 500;
let lastTime = 0;

// 🎨 方块 + 颜色
const SHAPES = [
  { shape:[[1,1,1,1]], color:"cyan" },
  { shape:[[1,1],[1,1]], color:"yellow" },
  { shape:[[0,1,0],[1,1,1]], color:"purple" },
  { shape:[[1,0,0],[1,1,1]], color:"blue" },
  { shape:[[0,0,1],[1,1,1]], color:"orange" }
];

// 🎲 生成方块
function randomPiece(){
  let p = SHAPES[Math.floor(Math.random()*SHAPES.length)];
  return {
    shape: p.shape,
    color: p.color,
    x: 3,
    y: 0
  };
}

let piece = randomPiece();

// 🧱 画方块
function drawBlock(x,y,color){
  ctx.fillStyle = color;
  ctx.fillRect(x*SIZE,y*SIZE,SIZE,SIZE);

  ctx.strokeStyle = "#000";
  ctx.strokeRect(x*SIZE,y*SIZE,SIZE,SIZE);
}

// 🎨 渲染
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // 👻 影子
  let ghostY = piece.y;
  while(!collideAt(piece.x, ghostY + 1, piece.shape)){
    ghostY++;
  }

  piece.shape.forEach((row,i)=>{
    row.forEach((v,j)=>{
      if(v){
        drawBlock(piece.x+j, ghostY+i, "rgba(255,255,255,0.2)");
      }
    });
  });

  // 🧱 已固定
  for(let r=0;r<ROW;r++){
    for(let c=0;c<COL;c++){
      if(board[r][c]){
        drawBlock(c,r,board[r][c]);
      }
    }
  }

  // 🎯 当前方块
  piece.shape.forEach((row,i)=>{
    row.forEach((v,j)=>{
      if(v){
        drawBlock(piece.x+j, piece.y+i, piece.color);
      }
    });
  });
}

// 🚧 碰撞检测
function collide(){
  return collideAt(piece.x, piece.y, piece.shape);
}

function collideAt(x, y, shape){
  for(let i=0;i<shape.length;i++){
    for(let j=0;j<shape[i].length;j++){
      if(shape[i][j]){
        let newX = x + j;
        let newY = y + i;

        if(newX < 0 || newX >= COL || newY >= ROW){
          return true;
        }
        if(newY >= 0 && board[newY][newX]){
          return true;
        }
      }
    }
  }
  return false;
}

// 🧱 固定
function merge(){
  piece.shape.forEach((row,i)=>{
    row.forEach((v,j)=>{
      if(v){
        board[piece.y+i][piece.x+j] = piece.color;
      }
    });
  });
}

// 🏆 消行 + 加速
function clearLines(){
  let lines = 0;

  for(let r=ROW-1;r>=0;r--){
    if(board[r].every(v=>v)){
      board.splice(r,1);
      board.unshift(Array(COL).fill(0));
      lines++;
      r++;
    }
  }

  if(lines > 0){
    score += lines * 10;

    if(score % 100 === 0 && dropSpeed > 100){
      dropSpeed -= 50;
    }

    document.getElementById("score").innerText = score;
  }
}

// ⬇️ 下落
function drop(){
  piece.y++;

  if(collide()){
    piece.y--;
    merge();
    clearLines();

    piece = randomPiece();

    if(collide()){
      alert("游戏结束！");
      board = Array.from({ length: ROW }, () => Array(COL).fill(0));
      score = 0;
      dropSpeed = 500;
    }
  }

  draw();
}

// ⬅️➡️ 移动
function move(dir){
  piece.x += dir;
  if(collide()) piece.x -= dir;
  draw();
}

// 🔄 旋转
function rotate(){
  let old = piece.shape;
  piece.shape = piece.shape[0].map((_,i)=>piece.shape.map(r=>r[i])).reverse();

  if(collide()){
    piece.shape = old;
  }
  draw();
}

// 🎮 键盘
document.addEventListener("keydown", e=>{
  if(e.key === "ArrowLeft") move(-1);
  if(e.key === "ArrowRight") move(1);
  if(e.key === "ArrowDown") drop();
  if(e.key === "ArrowUp") rotate();
});

// ⚡ 动画循环（替代 setInterval）
function update(time=0){
  if(time - lastTime > dropSpeed){
    drop();
    lastTime = time;
  }
  requestAnimationFrame(update);
}

// 🚀 启动
update();
draw();