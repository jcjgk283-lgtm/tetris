const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const COL = 10;
const ROW = 20;
const SIZE = 30;

let board = Array.from({ length: ROW }, () => Array(COL).fill(0));

const SHAPES = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]]
];

let piece = randomPiece();

function randomPiece(){
    return {
        shape: SHAPES[Math.floor(Math.random()*SHAPES.length)],
        x: 3,
        y: 0
    };
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // 画已固定方块
    for(let r=0;r<ROW;r++){
        for(let c=0;c<COL;c++){
            if(board[r][c]){
                drawBlock(c,r,"cyan");
            }
        }
    }

    // 画当前方块
    piece.shape.forEach((row,i)=>{
        row.forEach((v,j)=>{
            if(v){
                drawBlock(piece.x+j, piece.y+i,"orange");
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
    for(let i=0;i<piece.shape.length;i++){
        for(let j=0;j<piece.shape[i].length;j++){
            if(piece.shape[i][j]){
                let newX = piece.x + j;
                let newY = piece.y + i;

                // ❗边界检测（关键修复）
                if(newX < 0 || newX >= COL || newY >= ROW){
                    return true;
                }

                // ❗堆叠检测
                if(newY >= 0 && board[newY][newX]){
                    return true;
                }
            }
        }
    }
    return false;
}

function merge(){
    piece.shape.forEach((row,i)=>{
        row.forEach((v,j)=>{
            if(v){
                board[piece.y+i][piece.x+j] = 1;
            }
        });
    });
}

function drop(){
    piece.y++;

    if(collide()){
        piece.y--;
        merge();
        clearLines();

        // ✅ 关键：生成新方块
        piece = randomPiece();

        // ❗如果新方块一出来就撞 = 游戏结束
        if(collide()){
            alert("游戏结束！");
            board = Array.from({ length: ROW }, () => Array(COL).fill(0));
        }
    }

    draw();
}

function move(dir){
    piece.x += dir;
    if(collide()) piece.x -= dir;
    draw();
}

function rotate(){
    let old = piece.shape;
    piece.shape = piece.shape[0].map((_,i)=>piece.shape.map(r=>r[i])).reverse();

    if(collide()){
        piece.shape = old;
    }
    draw();
}

function clearLines(){
    for(let r=ROW-1;r>=0;r--){
        if(board[r].every(v=>v)){
            board.splice(r,1);
            board.unshift(Array(COL).fill(0));
            r++;
        }
    }
}

// 自动下落（速度正常）
setInterval(drop, 500);

// 初始绘制
draw();