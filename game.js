const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const SIZE = 20;

let x = 5;
let y = 0;

function draw(){
    ctx.clearRect(0,0,240,400);

    ctx.fillStyle = "red";
    ctx.fillRect(x*SIZE, y*SIZE, SIZE, SIZE);
}

// 按钮控制
function move(dir){
    x += dir;
    draw();
}

function drop(){
    y += 1;
    draw();
}

function rotate(){
    // 简化：先不做旋转逻辑
    alert("旋转成功（演示）");
}

// 自动下落
setInterval(()=>{
    y++;
    if(y > 18){
        y = 0;
    }
    draw();
}, 500);

// 初始化
draw();