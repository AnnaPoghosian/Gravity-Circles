const canvas: HTMLCanvasElement = document.getElementById('gravityCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as HTMLElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const circles: Circle[] = [];
let lastTime = 0;

class Circle {
  x: number;
  y: number;
  radius: number;
  color: string;
  dy: number;
  gravity: number;
  dampening: number;

  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dy = 0; 
    this.gravity = 0.5; 
    this.dampening = 0.9; 
  }

  draw(): void {
    const gradient = ctx.createLinearGradient(
      this.x - this.radius,
      this.y - this.radius,
      this.x + this.radius,
      this.y + this.radius
    );

    gradient.addColorStop(0, "#fff"); 
    gradient.addColorStop(1, this.color); 

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
    ctx.shadowInset = true;
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#fff";
  }

  update(): void {
    // Apply gravity
    this.dy += this.gravity;

    // Update position
    this.y += this.dy;

    if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius;
      this.dy *= -this.dampening;
    }

    this.draw();
  }
}

function tick(currentTime: number) {
  const deltaTime = currentTime - lastTime;

  // Update game elements using deltaTime
  circles.forEach(circle => {
    circle.update();
  });

  lastTime = currentTime;
  requestAnimationFrame(tick);
}

function animate(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  circles.forEach(circle => {
    circle.update();
  });

  requestAnimationFrame(animate);
}
function spawnCircle(x: number, y: number): void {
  const radius: number = 50;
  const color: string = getRandomColor();
  const circle: Circle = new Circle(x, y, radius, color);
  circles.push(circle);
}

function getRandomColor(): string {
  const red: number = Math.floor(Math.random() * 256);
  const green: number = Math.floor(Math.random() * 256);
  const blue: number = Math.floor(Math.random() * 256);
  const color: string = `rgb(${red}, ${green}, ${blue})`;
  return color;
}

canvas.addEventListener('click', (e: MouseEvent) => {
  spawnCircle(e.clientX, e.clientY);
});

spawnCircle(canvas.width / 2, canvas.height / 2);

animate();
requestAnimationFrame(tick);
