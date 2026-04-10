const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const COL = 10;
const ROW = 20;
const SIZE = 20;

let board = Array.from({length: ROW}, () => Array(COL).fill(0));

const COLORS = ["cyan","yellow","purple","green","red","blue","orange"];

const SHAPES = [
 [[1,1,1,1]],
 [[1,1],[1,1]],
 [[0,1,0],[1,1,1]],
 [[1,1,0],[0,1,1]],
 [[0,1,1],[1,1,0]],
 [[1,0,0],[1,1,1]],
 [[0,0,1],[1,1,1]]
];

function randomPiece(){
    let i = Math.floor(Math.random()*SHAPES.length);
    return {
        shape: SHAPES[i],
        color: COLORS[i],
        x: 3,
        y: 0
    };
}

let current = randomPiece();
let next = randomPiece();
let score = 0;

function drawCell(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SIZE, y*SIZE, SIZE, SIZE);
    ctx.strokeStyle="#111";
    ctx.strokeRect(x*SIZE, y*SIZE, SIZE, SIZE);
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // 画板
    for(let r=0;r<ROW;r++){
        for(let c=0;c<COL;c++){
            if(board[r][c]){
                drawCell(c,r,board[r][c]);
            }
        }
    }

    // 当前方块
    current.shape.forEach((row,i)=>{
        row.forEach((v,j)=>{
            if(v){
                drawCell(current.x+j,current.y+i,current.color);
            }
        });
    });
}

function collide(){
    for(let i=0;i<current.shape.length;i++){
        for(let j=0;j<current.shape[i].length;j++){
            if(current.shape[i][j]){
                let x = current.x + j;
                let y = current.y + i;

                if(x<0 || x>=COL || y>=ROW || board[y][x]){
                    return true;
                }
            }
        }
    }
    return false;
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
    for(let r=ROW-1;r>=0;r--){
        if(board[r].every(v=>v)){
            board.splice(r,1);
            board.unshift(Array(COL).fill(0));
            score += 10;
        }
    }
    document.getElementById("score").innerText = "🏆 分数："+score;
}

function drop(){
    current.y++;
    if(collide()){
        current.y--;
        merge();
        clearLines();
        current = next;
        next = randomPiece();
        if(collide()){
            alert("游戏结束！");
            board = Array.from({length: ROW}, () => Array(COL).fill(0));
            score = 0;
        }
    }
    draw();
}

function move(dir){
    current.x += dir;
    if(collide()) current.x -= dir;
    draw();
}

function rotate(){
    let old = current.shape;
    current.shape = current.shape[0].map((_,i)=>current.shape.map(r=>r[i])).reverse();
    if(collide()) current.shape = old;
    draw();
}

// 自动下落
setInterval(drop, 500);

// 键盘控制
document.addEventListener("keydown", e=>{
    if(e.key==="ArrowLeft") move(-1);
    if(e.key==="ArrowRight") move(1);
    if(e.key==="ArrowDown") drop();
    if(e.key==="ArrowUp") rotate();
});

draw();