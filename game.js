const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ROW = 20;
const COL = 10;
const SIZE = 30;

let board = Array.from({length: ROW}, () => Array(COL).fill(0));

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

function newPiece() {
    piece = SHAPES[Math.floor(Math.random()*SHAPES.length)];
    x = 3;
    y = 0;
}

function drawCell(x,y,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*SIZE,y*SIZE,SIZE,SIZE);
}

function draw() {
    ctx.clearRect(0,0,300,600);

    board.forEach((row,r)=>{
        row.forEach((v,c)=>{
            if(v) drawCell(c,r,"cyan");
        });
    });

    piece.forEach((row,i)=>{
        row.forEach((v,j)=>{
            if(v) drawCell(x+j,y+i,"orange");
        });
    });
}

function collide(nx,ny,npiece){
    for(let i=0;i<npiece.length;i++){
        for(let j=0;j<npiece[i].length;j++){
            if(npiece[i][j]){
                let newX = nx+j;
                let newY = ny+i;
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
            if(v) board[y+i][x+j]=1;
        });
    });
}

function clearLines(){
    board = board.filter(row=>row.some(v=>!v));
    while(board.length<ROW){
        board.unshift(Array(COL).fill(0));
        score+=10;
    }
    document.getElementById("score").innerText = score;
}

function rotate(){
    let newPiece = piece[0].map((_,i)=>piece.map(row=>row[i]).reverse());
    if(!collide(x,y,newPiece)) piece = newPiece;
}

function move(dir){
    if(!collide(x+dir,y,piece)) x+=dir;
}

function drop(){
    if(!collide(x,y+1,piece)){
        y++;
    } else {
        merge();
        clearLines();
        newPiece();
    }
}

function loop(){
    drop();
    draw();
    requestAnimationFrame(loop);
}

document.addEventListener("keydown",e=>{
    if(e.key==="ArrowLeft") move(-1);
    if(e.key==="ArrowRight") move(1);
    if(e.key==="ArrowUp") rotate();
    if(e.key==="ArrowDown") drop();
});

document.body.addEventListener("click",()=>{
    document.getElementById("bgm").play();
});

newPiece();
loop();