const canvas = document.getElementById('gravityCanvas') as HTMLCanvasElement;
const canvasContext: CanvasRenderingContext2D | null = canvas.getContext('2d');

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

  draw(canvasContext: CanvasRenderingContext2D): void {
    const gradient = canvasContext.createLinearGradient(
      this.x - this.radius,
      this.y - this.radius,
      this.x + this.radius,
      this.y + this.radius
    );

    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(1, this.color);

    canvasContext.beginPath();
    canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    canvasContext.fillStyle = gradient;
    canvasContext.fill();
    canvasContext.closePath();
    canvasContext.shadowBlur = 30;
    canvasContext.shadowColor = "#fff";
  }

  update(canvas: HTMLCanvasElement): void {
    this.dy += this.gravity;
    this.y += this.dy;

    if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius;
      this.dy *= -this.dampening;
    }
  }
}

function getRandomColor(): string {
  const red: number = Math.floor(Math.random() * 256);
  const green: number = Math.floor(Math.random() * 256);
  const blue: number = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const circlesList: Circle[] = [];
let lastTime = 0;

function tick(currentTime: number) {
  const deltaTime = currentTime - lastTime;

  circlesList.forEach((circle) => {
    circle.update(canvas);
  });

  lastTime = currentTime;
  requestAnimationFrame(() => tick(currentTime));
}

function spawnCircle(x: number, y: number): void {
  const radius: number = 50;
  const color: string = getRandomColor();
  const circle: Circle = new Circle(x, y, radius, color);
  circlesList.push(circle);
}

function animateCircles(
  circlesList: Circle[],
  canvasContext: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  circlesList.forEach((circle) => {
    circle.update(canvas);
    circle.draw(canvasContext);
  });

  requestAnimationFrame(() => animateCircles(circlesList, canvasContext, canvas));
}

canvas.addEventListener('click', (e: MouseEvent) => {
  spawnCircle(e.clientX, e.clientY);
});

spawnCircle(canvas.width / 2, canvas.height / 2);

animateCircles(circlesList, canvasContext!, canvas);
requestAnimationFrame(tick);
