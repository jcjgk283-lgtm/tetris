const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ROW = 20;
const COL = 10;
const SIZE = 30;

let board = Array.from({ length: ROW }, () => Array(COL).fill(0));

const COLORS = ["#0ff","#ff0","#f0f","#0f0","#f00","#00f","#fa0"];

const SHAPES = [
[[1,1,1,1]],
[[1,1],[1,1]],
[[0,1,0],[1,1,1]],
[[1,1,0],[0,1,1]],
[[0,1,1],[1,1,0]],
[[1,0,0],[1,1,1]],
[[0,0,1],[1,1,1]]
];

let piece, color, x, y;
let score = 0;

let dropInterval = 600;
let lastTime = 0;

function newPiece() {
    let id = Math.floor(Math.random()*SHAPES.length);
    piece = SHAPES[id];
    color = COLORS[id];
    x = 3;
    y = 0;
}

function drawCell(x,y,color){
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fillRect(x*SIZE,y*SIZE,SIZE,SIZE);
}

function draw(){
    ctx.fillStyle="#000";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    board.forEach((row,r)=>{
        row.forEach((v,c)=>{
            if(v) drawCell(c,r,v);
        });
    });

    piece.forEach((row,i)=>{
        row.forEach((v,j)=>{
            if(v) drawCell(x+j,y+i,color);
        });
    });
}

function collide(nx,ny,p=piece){
    for(let i=0;i<p.length;i++){
        for(let j=0;j<p[i].length;j++){
            if(p[i][j]){
                let newX=nx+j;
                let newY=ny+i;
                if(newX<0||newX>=COL||newY>=ROW) return true;
                if(board[newY] && board[newY][newX]) return true;
            }
        }
    }
    return false;
}

function merge(){
    piece.forEach((row,i)=>{
        row.forEach((v,j)=>{
            if(v) board[y+i][x+j]=color;
        });
    });
}

function clearLines(){
    let lines=0;

    board = board.filter(row=>{
        if(row.every(v=>v)){
            lines++;
            return false;
        }
        return true;
    });

    while(board.length<ROW){
        board.unshift(Array(COL).fill(0));
    }

    if(lines>0){
        score += lines*100;
        document.getElementById("score").innerText=score;
    }
}

function rotate(){
    let newPiece = piece[0].map((_,i)=>piece.map(r=>r[i]).reverse());
    if(!collide(x,y,newPiece)) piece=newPiece;
}

function move(dir){
    if(!collide(x+dir,y)) x+=dir;
}

function drop(){
    if(!collide(x,y+1)){
        y++;
    }else{
        merge();
        clearLines();
        newPiece();

        if(collide(x,y)){
            alert("游戏结束！");
            board = Array.from({ length: ROW }, () => Array(COL).fill(0));
            score=0;
        }
    }
}

function loop(time=0){
    if(time-lastTime>dropInterval){
        drop();
        lastTime=time;
    }
    draw();
    requestAnimationFrame(loop);
}

// 控制
document.addEventListener("keydown",e=>{
    if(e.key==="ArrowLeft") move(-1);
    if(e.key==="ArrowRight") move(1);
    if(e.key==="ArrowUp") rotate();
    if(e.key==="ArrowDown") drop();
});

// 手机按钮（你HTML已有）
window.moveLeft=()=>move(-1);
window.moveRight=()=>move(1);
window.rotate=()=>rotate();
window.drop=()=>drop();

// 音乐
document.body.addEventListener("click",()=>{
    const bgm=document.getElementById("bgm");
    if(bgm) bgm.play();
},{once:true});

// 启动
newPiece();
loop();