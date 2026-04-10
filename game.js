const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ROW = 20;
const COL = 10;
const SIZE = 30;

let board = Array.from({length: ROW}, () => Array(COL).fill(0));

const SHAPES = [
  [[1,1,1],[0,1,0]],
  [[1,1],[1,1]],
  [[1,1,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]]
];

let piece, x, y;
let score = 0;

function newPiece(){
  piece = SHAPES[Math.floor(Math.random()*SHAPES.length)];
  x = 3;
  y = 0;

  if(collision(x,y,piece)){
    alert("游戏结束");
    location.reload();
  }
}

function drawBlock(px, py, color){
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillRect(px, py, SIZE, SIZE);
  ctx.shadowBlur = 0;
}

function draw(){
  ctx.clearRect(0,0,300,600);

  // 已固定
  for(let r=0;r<ROW;r++){
    for(let c=0;c<COL;c++){
      if(board[r][c]){
        drawBlock(c*SIZE,r*SIZE,"cyan");
      }
    }
  }

  // 当前块
  piece.forEach((row,i)=>{
    row.forEach((v,j)=>{
      if(v){
        drawBlock((x+j)*SIZE,(y+i)*SIZE,"red");
      }
    });
  });
}

function collision(nx,ny,p){
  return p.some((row,i)=>
    row.some((v,j)=>{
      if(!v) return false;
      let newX = nx + j;
      let newY = ny + i;
      return newX<0 || newX>=COL || newY>=ROW || board[newY]?.[newX];
    })
  );
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

function clearLines(){
  for(let r=ROW-1;r>=0;r--){
    if(board[r].every(v=>v)){
      board.splice(r,1);
      board.unshift(Array(COL).fill(0));
      score+=10;
      document.getElementById("score").innerText=score;
      r++;
    }
  }
}

function move(dir){
  if(!collision(x+dir,y,piece)){
    x+=dir;
  }
}

function softDrop(){
  if(!collision(x,y+1,piece)){
    y++;
  }
}

function hardDrop(){
  while(!collision(x,y+1,piece)){
    y++;
  }
}

function rotate(){
  let newP = piece[0].map((_,i)=>piece.map(r=>r[i]).reverse());
  if(!collision(x,y,newP)){
    piece=newP;
  }
}

// 🎮 游戏循环（流畅关键）
let lastTime = 0;
let dropCounter = 0;
let dropInterval = 700;

function update(time=0){
  const delta = time - lastTime;
  lastTime = time;
  dropCounter += delta;

  if(dropCounter > dropInterval){
    if(!collision(x,y+1,piece)){
      y++;
    }else{
      merge();
      clearLines();
      newPiece();
    }
    dropCounter = 0;
  }

  draw();
  requestAnimationFrame(update);
}

newPiece();
update();

// 键盘
document.addEventListener("keydown",(e)=>{
  if(e.key==="ArrowLeft") move(-1);
  if(e.key==="ArrowRight") move(1);
  if(e.key==="ArrowDown") softDrop();
  if(e.key===" ") hardDrop();
  if(e.key==="ArrowUp") rotate();
});