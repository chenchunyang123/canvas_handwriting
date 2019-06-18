let canvasWidth = 600;
let canvasHeight = canvasWidth;
let girdColor = 'rgb(230, 11, 9)';    // 红色线框
let strokeColor = 'black';
let isMouseDown = false;    // 鼠标是否按下
let lastLocation = {x: 0, y: 0};    // 鼠标上一次的位置（用来绘制连续的线）
let lastTimeStamp = 0;      // 定义时间戳(根据运笔时间决定线条粗细)
let lastLineWidth = -1;      // 定义上一次线条宽度(防止线条宽度变化太突然)

let canvas = $('#canvas')[0];
let cxt = canvas.getContext('2d');

canvas.width = canvasWidth;
canvas.height = canvasHeight;

cxt.strokeStyle = girdColor;   

drawGird();

// 清除画布
$('#clear').click(() => {
    cxt.clearRect(0, 0, canvasWidth, canvasHeight);
    cxt.strokeStyle = girdColor;
    drawGird();
})

// 改变画笔的颜色
$('.color_btn').click(function() {
    $('.color_btn').removeClass('selected');
    $(this).addClass('selected');
    strokeColor = $(this).css('background-color');
})

// 绑定鼠标事件
canvas.onmousedown = function (e) {
    e.preventDefault();
    isMouseDown = true;
    lastLocation = windowToCanvas(e.clientX, e.clientY);
    lastTimeStamp = new Date().getTime();
}
canvas.onmousemove = function (e) {
    e.preventDefault();
    if(isMouseDown) {
        let currentLocation = windowToCanvas(e.clientX, e.clientY);
        let currentTimeStamp = new Date().getTime();
        let s = calcDistance(currentLocation, lastLocation);
        let t = currentTimeStamp - lastTimeStamp;

        let lineWidth = calcLineWidth(s, t);
        // draw
        cxt.beginPath();
        cxt.moveTo(lastLocation.x, lastLocation.y);
        cxt.lineTo(currentLocation.x, currentLocation.y);
        cxt.strokeStyle = strokeColor;
        cxt.lineWidth = lineWidth;
        cxt.lineCap = 'round';  // 解决线段转角交接空白问题
        cxt.lineJoin = 'round'; // 两条线交汇时，创建圆形边角
        cxt.stroke();

        lastLocation = currentLocation;
        lastTimeStamp = currentTimeStamp;
        lastLineWidth = lineWidth;
    }
}
canvas.onmouseup = function (e) {
    e.preventDefault();
    isMouseDown = false;
}
canvas.onmouseout = function (e) {
    e.preventDefault();
    isMouseDown = false;
}

// 根据运笔速度决定线条的粗细
function calcLineWidth(s, t) {
    let v = s / t;
    let resultLineWidth;
    if(v <= 0.1) {
        resultLineWidth = 30;
    } else if(v > 10) {
        resultLineWidth = 1;
    } else {
        resultLineWidth = 30 - (v - 0.1)/(10 - 0.1)*(30 - 1)
    }

    if(lastLineWidth = -1) {
        return resultLineWidth;
    } else {
        return lastLineWidth * 2/3 + resultLineWidth * 1/3;
    }
}

// 计算两点之间的距离
function calcDistance(loc1, loc2) {
    return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y));
}

// 获取鼠标在canvas上的坐标
function windowToCanvas(x, y) {
    let bbox = canvas.getBoundingClientRect();
    return {
        x: Math.round(x - bbox.left), 
        y: Math.round(y - bbox.top)
    };
}

// 绘制米字格
function drawGird() {
    cxt.save();
    // 1、外边框
    cxt.beginPath();
    cxt.moveTo(3, 3);
    cxt.lineTo(canvasWidth - 3, 3);
    cxt.lineTo(canvasWidth - 3, canvasWidth - 3);
    cxt.lineTo(3, canvasWidth - 3);
    cxt.closePath();
    
    cxt.lineWidth = 6;
    cxt.stroke();
    
    // 2、米字格
    cxt.beginPath();
    cxt.moveTo(0, 0);
    cxt.lineTo(canvasWidth, canvasHeight);
    
    cxt.moveTo(canvasWidth, 0);
    cxt.lineTo(0, canvasHeight);
    
    cxt.moveTo(canvasWidth / 2, 0);
    cxt.lineTo(canvasWidth / 2, canvasHeight);
    
    cxt.moveTo(0, canvasHeight / 2);
    cxt.lineTo(canvasWidth, canvasHeight / 2);
    
    cxt.lineWidth = 1;
    cxt.stroke();

    cxt.restore();
}