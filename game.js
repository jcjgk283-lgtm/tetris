const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ROW = 20;
const COL = 12;
const SIZE = 20;

let board = Array.from({length:ROW},()=>Array(COL).fill(0));

const shapes = [
 [[1,1,1,1]],
 [[1,1],[1,1]],
 [[0,1,0],[1,1,1]],
];

let piece = shapes[Math.floor(Math.random()*shapes.length)];
let x = 4, y = 0;

function draw(){
    ctx.clearRect(0,0,240,400);
    ctx.fillStyle="red";
    piece.forEach((row,i)=>{
        row.forEach((v,j)=>{
            if(v){
                ctx.fillRect((x+j)*SIZE,(y+i)*SIZE,SIZE,SIZE);
            }
        });
    });
}

function move(dir){
    x+=dir;
    draw();
}

function drop(){
    y++;
    draw();
}

function rotate(){
    piece = piece[0].map((_,i)=>piece.map(r=>r[i])).reverse();
    draw();
}

setInterval(()=>{
    y++;
    if(y>18){
        y=0;
        x=4;
    }
    draw();
},500);

draw();