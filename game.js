const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const COL = 10;
const ROW = 20;
const SIZE = 30;

let score = 0;

let board = Array.from({ length: ROW }, () => Array(COL).fill(0));

const COLORS = ["cyan","yellow","purple","orange","blue"];

const SHAPES = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]]
];

let piece = newPiece();

function newPiece(){
    let shape = SHAPES[Math.floor(Math.random()*SHAPES.length)];
    return {
        shape,
        color: COLORS[Math.floor(Math.random()*COLORS.length)],
        x: Math.floor((COL - shape[0].length)/2),
        y: 0
    };
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(let r=0;r<ROW;r++){
        for(let c=0;c<COL;c++){
            if(board[r][c]){
                drawBlock(c,r,"cyan");
            }
        }
    }

    piece.shape.forEach((row,i)=>{
        row.forEach((v,j)=>{
            if(v){
                drawBlock(piece.x+j,piece.y+i,piece.color);
            }
        });
    });
}

function drawBlock(x,y,color){
    ctx.fillStyle=color;
    ctx.fillRect(x*SIZE,y*SIZE,SIZE,SIZE);

    ctx.strokeStyle="#000";
    ctx.strokeRect(x*SIZE,y*SIZE,SIZE,SIZE);
}

function collide(){
    return piece.shape.some((row,i)=>
        row.some((v,j)=>{
            if(!v) return false;

            let x = piece.x+j;
            let y = piece.y+i;

            return (
                x<0 || x>=COL ||
                y>=ROW ||
                (y>=0 && board[y][x])
            );
        })
    );
}

function merge(){
    piece.shape.forEach((row,i)=>{
        row.forEach((v,j)=>{
            if(v){
                let y = piece.y+i;
                if(y>=0){
                    board[y][piece.x+j] = 1;
                }
            }
        });
    });
}

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

    if(lines){
        score += lines * 10;
        document.getElementById("score").innerText = score;
    }
}

function drop(){
    piece.y++;

    if(collide()){
        piece.y--;
        merge();
        clearLines();
        piece = newPiece();

        if(collide()){
            alert("游戏结束！");
            board = Array.from({ length: ROW }, () => Array(COL).fill(0));
            score = 0;
        }
    }
}

function move(dir){
    piece.x += dir;
    if(collide()) piece.x -= dir;
}

function rotate(){
    let old = piece.shape;

    let rotated = piece.shape[0].map((_,i)=>
        piece.shape.map(r=>r[i]).reverse()
    );

    piece.shape = rotated;

    if(collide()){
        piece.x++;
        if(collide()){
            piece.x -= 2;
            if(collide()){
                piece.x++;
                piece.shape = old;
            }
        }
    }
}

let last = 0;
let acc = 0;
let speed = 500;

function update(time=0){
    let delta = time - last;
    last = time;

    acc += delta;
    if(acc > speed){
        drop();
        acc = 0;
    }

    draw();
    requestAnimationFrame(update);
}

update();