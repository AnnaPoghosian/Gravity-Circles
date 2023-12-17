"use strict";
var canvas = document.getElementById('gravityCanvas');
var canvasContext = canvas.getContext('2d');
var Circle = /** @class */ (function () {
    function Circle(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dy = 0;
        this.gravity = 0.5;
        this.dampening = 0.9;
    }
    Circle.prototype.draw = function (canvasContext) {
        var gradient = canvasContext.createLinearGradient(this.x - this.radius, this.y - this.radius, this.x + this.radius, this.y + this.radius);
        gradient.addColorStop(0, "#fff");
        gradient.addColorStop(1, this.color);
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        canvasContext.fillStyle = gradient;
        canvasContext.fill();
        canvasContext.closePath();
        canvasContext.shadowBlur = 30;
        canvasContext.shadowColor = "#fff";
    };
    Circle.prototype.update = function (canvas) {
        this.dy += this.gravity;
        this.y += this.dy;
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.dy *= -this.dampening;
        }
    };
    return Circle;
}());
function getRandomColor() {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);
    return "rgb(".concat(red, ", ").concat(green, ", ").concat(blue, ")");
}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var circlesList = [];
var lastTime = 0;
function tick(currentTime) {
    var deltaTime = currentTime - lastTime;
    circlesList.forEach(function (circle) {
        circle.update(canvas);
    });
    lastTime = currentTime;
    requestAnimationFrame(function () { return tick(currentTime); });
}
function spawnCircle(x, y) {
    var radius = 50;
    var color = getRandomColor();
    var circle = new Circle(x, y, radius, color);
    circlesList.push(circle);
}
function animateCircles(circlesList, canvasContext, canvas) {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    circlesList.forEach(function (circle) {
        circle.update(canvas);
        circle.draw(canvasContext);
    });
    requestAnimationFrame(function () { return animateCircles(circlesList, canvasContext, canvas); });
}
canvas.addEventListener('click', function (e) {
    spawnCircle(e.clientX, e.clientY);
});
spawnCircle(canvas.width / 2, canvas.height / 2);
animateCircles(circlesList, canvasContext, canvas);
requestAnimationFrame(tick);
