const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const nextCanvas = document.getElementById("next");
const nextCtx = nextCanvas.getContext("2d");

const COL=10, ROW=20, SIZE=30;

const COLORS=["cyan","yellow","purple","green","red","blue","orange"];

const SHAPES=[
[[1,1,1,1]],
[[1,1],[1,1]],
[[0,1,0],[1,1,1]],
[[1,1,0],[0,1,1]],
[[0,1,1],[1,1,0]],
[[1,0,0],[1,1,1]],
[[0,0,1],[1,1,1]]
];

let board=Array.from({length:ROW},()=>Array(COL).fill(0));

let current,next;
let score=0,level=1;

function newPiece(){
  return {
    shape:SHAPES[Math.floor(Math.random()*7)],
    color:COLORS[Math.floor(Math.random()*7)],
    x:3,y:0
  };
}

current=newPiece();
next=newPiece();

function drawBlock(x,y,color,ctx2=ctx){
  ctx2.fillStyle=color;
  ctx2.shadowColor=color;
  ctx2.shadowBlur=10;
  ctx2.fillRect(x,y,SIZE,SIZE);
  ctx2.shadowBlur=0;
}

function draw(){
  ctx.clearRect(0,0,300,600);

  for(let r=0;r<ROW;r++){
    for(let c=0;c<COL;c++){
      if(board[r][c]){
        drawBlock(c*SIZE,r*SIZE,board[r][c]);
      }
    }
  }

  current.shape.forEach((row,i)=>{
    row.forEach((v,j)=>{
      if(v){
        drawBlock((current.x+j)*SIZE,(current.y+i)*SIZE,current.color);
      }
    });
  });

  drawNext();
}

function drawNext(){
  nextCtx.clearRect(0,0,120,120);
  next.shape.forEach((row,i)=>{
    row.forEach((v,j)=>{
      if(v){
        drawBlock(j*20,i*20,next.color,nextCtx);
      }
    });
  });
}

function collide(px,py,shape){
  return shape.some((row,i)=>
    row.some((v,j)=>{
      if(!v) return false;
      let x=px+j,y=py+i;
      return x<0||x>=COL||y>=ROW||board[y]?.[x];
    })
  );
}

function merge(){
  current.shape.forEach((row,i)=>{
    row.forEach((v,j)=>{
      if(v){
        board[current.y+i][current.x+j]=current.color;
      }
    });
  });
}

function clearLines(){
  let lines=0;
  for(let r=ROW-1;r>=0;r--){
    if(board[r].every(v=>v)){
      board.splice(r,1);
      board.unshift(Array(COL).fill(0));
      lines++;
      r++;
    }
  }

  if(lines){
    score+=lines*10;
    level=Math.floor(score/50)+1;
    document.getElementById("score").innerText=score;
    document.getElementById("level").innerText=level;
  }
}

function drop(){
  if(!collide(current.x,current.y+1,current.shape)){
    current.y++;
  }else{
    merge();
    clearLines();
    current=next;
    next=newPiece();

    if(collide(current.x,current.y,current.shape)){
      alert("游戏结束");
      location.reload();
    }
  }
}

function move(dir){
  if(!collide(current.x+dir,current.y,current.shape)){
    current.x+=dir;
  }
}

function softDrop(){
  drop();
}

function rotate(){
  let newShape=current.shape[0].map((_,i)=>current.shape.map(r=>r[i]).reverse());
  if(!collide(current.x,current.y,newShape)){
    current.shape=newShape;
  }
}

// 游戏循环
let last=0,acc=0;

function loop(time=0){
  const delta=time-last;
  last=time;
  acc+=delta;

  let speed=700-Math.min(level*50,500);

  if(acc>speed){
    drop();
    acc=0;
  }

  draw();
  requestAnimationFrame(loop);
}

loop();

// 键盘
document.addEventListener("keydown",e=>{
  if(e.key==="ArrowLeft") move(-1);
  if(e.key==="ArrowRight") move(1);
  if(e.key==="ArrowDown") softDrop();
  if(e.key==="ArrowUp") rotate();
});