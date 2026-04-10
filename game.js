const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ROW = 20;
const COL = 10;
const SIZE = 30;

canvas.width = COL * SIZE;
canvas.height = ROW * SIZE;

// 音乐
const bgm = document.getElementById("bgm");

// 点击页面才播放（防浏览器限制）
document.body.addEventListener("click", () => {
  bgm.play().catch(()=>{});
}, { once: true });

let board = Array.from({ length: ROW }, () => Array(COL).fill(0));

const SHAPES = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1]], // T
  [[1,1,0],[0,1,1]], // S
  [[0,1,1],[1,1,0]], // Z
  [[1,0,0],[1,1,1]], // L
  [[0,0,1],[1,1,1]]  // J
];

let piece, x, y;

function newPiece() {
  piece = SHAPES[Math.floor(Math.random()*SHAPES.length)];
  x = 3;
  y = 0;
}

function drawCell(x,y,color="cyan"){
  ctx.fillStyle = color;
  ctx.fillRect(x*SIZE,y*SIZE,SIZE,SIZE);
  ctx.strokeStyle = "#111";
  ctx.strokeRect(x*SIZE,y*SIZE,SIZE,SIZE);
}

function draw(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // 画板子
  for(let r=0;r<ROW;r++){
    for(let c=0;c<COL;c++){
      if(board[r][c]){
        drawCell(c,r,"gray");
      }
    }
  }

  // 画当前方块
  piece.forEach((row,i)=>{
    row.forEach((v,j)=>{
      if(v){
        drawCell(x+j,y+i);
      }
    });
  });
}

function collide(){
  for(let i=0;i<piece.length;i++){
    for(let j=0;j<piece[i].length;j++){
      if(piece[i][j]){
        let newX = x+j;
        let newY = y+i;

        if(newX<0 || newX>=COL || newY>=ROW) return true;
        if(newY>=0 && board[newY][newX]) return true;
      }
    }
  }
  return false;
}

function merge(){
  piece.forEach((row,i)=>{
    row.forEach((v,j)=>{
      if(v){
        board[y+i][x+j]=1;
      }
    });
  });
}

function rotate(){
  let newP = piece[0].map((_,i)=>piece.map(r=>r[i]).reverse());
  let old = piece;
  piece = newP;
  if(collide()) piece = old;
}

function clearLines(){
  for(let r=ROW-1;r>=0;r--){
    if(board[r].every(v=>v)){
      board.splice(r,1);
      board.unshift(Array(COL).fill(0));
      score+=10;
      document.getElementById("score").innerText="🏆 分数："+score;
    }
  }
}

let score=0;

function drop(){
  y++;
  if(collide()){
    y--;
    merge();
    clearLines();
    newPiece();
    if(collide()){
      alert("游戏结束！");
      board = Array.from({ length: ROW }, () => Array(COL).fill(0));
      score=0;
    }
  }
}

function move(dir){
  x+=dir;
  if(collide()) x-=dir;
}

function hardDrop(){
  while(!collide()){
    y++;
  }
  y--;
  drop();
}

// 按键控制
document.addEventListener("keydown", e=>{
  if(e.key==="ArrowLeft") move(-1);
  if(e.key==="ArrowRight") move(1);
  if(e.key==="ArrowDown") drop();
  if(e.key==="ArrowUp") rotate();
});

// 按钮控制（你HTML里的）
function moveLeft(){move(-1)}
function moveRight(){move(1)}
function rotateBtn(){rotate()}
function dropBtn(){drop()}

// 游戏循环
newPiece();
setInterval(()=>{
  drop();
  draw();
},500);