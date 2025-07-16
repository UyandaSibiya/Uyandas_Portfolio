const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let fireworks = [];
let particles = [];

class Firework {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height;
    this.targetX = Math.random() * canvas.width;
    this.targetY = Math.random() * canvas.height / 2;
    this.coordinates = [];
    for (let i = 0; i < 3; i++) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = Math.random() * 50 + 50;
    this.exploded = false;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    this.speed *= this.acceleration;
    let vx = Math.cos(this.angle) * this.speed;
    let vy = Math.sin(this.angle) * this.speed;
    this.x += vx;
    this.y += vy;

    const distance = Math.hypot(this.targetX - this.x, this.targetY - this.y);
    if (distance < 10) {
      this.exploded = true;
      for (let i = 0; i < 30; i++) {
        particles.push(new Particle(this.targetX, this.targetY));
      }
      fireworks.splice(index, 1);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0],
               this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
    ctx.stroke();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    for (let i = 0; i < 5; i++) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.random() * 2 * Math.PI;
    this.speed = Math.random() * 5 + 2;
    this.friction = 0.95;
    this.gravity = 0.8;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.hue = Math.random() * 360;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= 0) {
      particles.splice(index, 1);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0],
               this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
    ctx.stroke();
  }
}

function loop() {
  requestAnimationFrame(loop);

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';

  if (Math.random() < 0.05) {
    fireworks.push(new Firework());
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    particles[i].update(i);
  }
}

loop();
