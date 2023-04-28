interface Lander {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fuel: number;
  angle: number;
}

function rotateScene(ctx: CanvasRenderingContext2D, lander: Lander) {
  ctx.translate(lander.x + 2.5, lander.y + 5);
  ctx.rotate(lander.angle);
  ctx.translate(-lander.x - 2.5, -lander.y - 5);
}

interface XY {
  x: number;
  y: number;
}

function drawThrustDown(ctx: CanvasRenderingContext2D, lander: Lander) {
  const p1 = {
    x: lander.x,
    y: lander.y + 10 + 5,
  };

  const p2 = {
    x: lander.x + 5,
    y: lander.y + 10 + 5,
  };

  const p3 = {
    x: lander.x + 2.5,
    y: lander.y + 15 + 5,
  };
  ctx.save();
  rotateScene(ctx, lander);

  drawThrust(ctx, p1, p2, p3);
  ctx.restore();
}

function drawThrustLeft(ctx: CanvasRenderingContext2D, lander: Lander) {
  const p1 = {
    x: lander.x + 5 + 5,
    y: lander.y + 2.5,
  };

  const p2 = {
    x: lander.x + 5 + 5,
    y: lander.y + 7.5,
  };

  const p3 = {
    x: lander.x + 5 + 10,
    y: lander.y + 5,
  };
  ctx.save();
  rotateScene(ctx, lander);

  drawThrust(ctx, p1, p2, p3);
  ctx.restore();
}

function drawThrustRight(ctx: CanvasRenderingContext2D, lander: Lander) {
  const p1 = {
    x: lander.x - 5,
    y: lander.y + 2.5,
  };

  const p2 = {
    x: lander.x - 5,
    y: lander.y + 7.5,
  };

  const p3 = {
    x: lander.x - 10,
    y: lander.y + 5,
  };
  ctx.save();
  rotateScene(ctx, lander);

  drawThrust(ctx, p1, p2, p3);
  ctx.restore();
}

function drawThrust(ctx: CanvasRenderingContext2D, p1: XY, p2: XY, p3: XY) {
  ctx.save();
  ctx.fillStyle = "orange";

  const path = new Path2D();
  path.moveTo(p1.x, p1.y);
  path.lineTo(p2.x, p2.y);
  path.lineTo(p3.x, p3.y);
  ctx.fill(path);

  ctx.restore();
}

function drawLander(ctx: CanvasRenderingContext2D, lander: Lander) {
  ctx.save();
  ctx.fillStyle = "red";

  ctx.translate(lander.x + 2.5, lander.y + 5);
  ctx.rotate(lander.angle);
  ctx.translate(-lander.x - 2.5, -lander.y - 5);

  // console.log(lander.angle, lander.x, lander.y);
  ctx.fillRect(lander.x, lander.y, 5, 10);
  ctx.restore();
}

function drawGround(ctx: CanvasRenderingContext2D, points: [number, number][]) {
  // ctx.fillStyle = "green";
  ctx.strokeStyle = "white";
  // console.log(points);
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);

  for (let i = 1; i < points.length; i++) {
    // console.log(i);
    ctx.lineTo(points[i][0], points[i][1]);
  }

  ctx.stroke();
}

function checkLineCross(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  lander: Lander
) {
  let i = 0;
  while (lander.x > points[i][0]) i++;

  const x1 = points[i][0];
  const y1 = points[i][1];
  const x2 = points[i + 1][0];
  const y2 = points[i + 1][1];

  const m = (y2 - y1) / (x2 - x1);
  const c = y2 - m * x2;

  const y = (x: number) => m * x + c;

  const y3 = y(lander.x);

  return y3 < lander.y || y3 < lander.y + 10;
  // y = mx + c
  // c = y - mx

  // (y2-y1) = m(x2-x1)
  // y = m(x2-x1) + y1
}

function main() {
  const canvas = document.getElementById("canvas");
  if (!canvas) throw new Error("Canvas not found");

  if (!(canvas instanceof HTMLCanvasElement))
    throw new Error("Canvas is not an HTMLCanvasElement");

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not found");

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const points: [number, number][] = [];
  let x = 0;
  let y = window.innerHeight - 100;
  while (x < window.innerWidth) {
    points.push([(x += 10), y + Math.random() * 20 - 10]);
  }

  const stats = document.getElementById("stats");
  if (!(stats instanceof HTMLDivElement)) {
    throw new Error("");
  }

  const lander = {
    x: window.innerWidth / 2,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    fuel: 100000000000,
  };

  const keys = {
    up: false,
    left: false,
    right: false,
    thrustLeft: false,
    thrustRight: false,
  };

  function animate() {
    if (!ctx) throw new Error("Canvas context not found");

    const gap = 1;

    ctx.save();
    ctx.translate(lander.x + 2.5, lander.y + 5);
    ctx.rotate(lander.angle);
    ctx.translate(-lander.x - 2.5, -lander.y - 5);
    // console.log(lander.x + gap, lander.y + gap, 5 + gap, 10 + gap);
    ctx.clearRect(lander.x - gap, lander.y - gap, 5 + 2 * gap, 10 + 2 * gap);
    ctx.clearRect(
      lander.x - gap,
      lander.y + 10 + 5 - gap,
      5 + 2 * gap,
      10 + 2 * gap
    );
    ctx.clearRect(
      lander.x + 5 + 5 - gap,
      lander.y + 2.5 - gap,
      5 + 2 * gap,
      5 + 2 * gap
    );
    ctx.clearRect(
      lander.x - 5 - 5 - gap,
      lander.y + 2.5 - gap,
      5 + 2 * gap,
      5 + 2 * gap
    );
    ctx.restore();

    // const p1 = {
    //   x: lander.x + 5 + 5,
    //   y: lander.y + 2.5,
    // };

    // const p2 = {
    //   x: lander.x + 5 + 5,
    //   y: lander.y + 7.5,
    // };

    // const p3 = {
    //   x: lander.x + 5 + 10,
    //   y: lander.y + 5,
    // };

    if (
      lander.x < 0 ||
      lander.x > window.innerWidth ||
      lander.y > window.innerHeight ||
      lander.y < 0 ||
      checkLineCross(ctx, points, lander)
    ) {
      lander.x = window.innerWidth / 2;
      lander.y = 0;
      lander.vx = 0;
      lander.vy = 0;
      lander.angle = 0;
    }

    lander.x += lander.vx;
    lander.y += lander.vy;
    lander.vy += 0.01;

    if (keys.up && lander.fuel > 0) {
      lander.vy -= Math.cos(lander.angle) * 0.05;
      lander.vx += Math.sin(lander.angle) * 0.05;

      lander.fuel -= 1;
      drawThrustDown(ctx, lander);
    }
    if (keys.thrustRight && lander.fuel > 0) {
      lander.vx -= Math.cos(lander.angle) * 0.01;
      lander.vy += Math.sin(lander.angle) * 0.01;
      drawThrustLeft(ctx, lander);

      lander.fuel -= 1;
    }
    if (keys.thrustLeft && lander.fuel > 0) {
      lander.vx += Math.cos(lander.angle) * 0.01;
      lander.vy -= Math.sin(lander.angle) * 0.01;
      drawThrustRight(ctx, lander);

      lander.fuel -= 1;
    }
    if ((keys.right && lander.fuel > 0) || (keys.left && lander.fuel > 0)) {
      lander.angle += keys.right ? 0.02 : -0.02;
    }
    drawLander(ctx, lander);

    if (!stats) return;
    const d1 = document.createElement("div");
    d1.innerText = lander.vx.toFixed(2);
    const d2 = document.createElement("div");
    d2.innerText = lander.vy.toFixed(2);

    stats.replaceChildren(
      // lander.x.toFixed(2),
      // lander.y.toFixed(2),
      d1,
      d2,
      ((lander.angle * 180) / Math.PI).toFixed(2)
    );

    drawGround(ctx, points);
    window.requestAnimationFrame(animate);
  }

  window.addEventListener("keydown", (event) => {
    console.log(event.key);
    switch (event.key) {
      case "ArrowUp":
      case "w":
        keys.up = true;
        break;
      case "ArrowRight":
      case "q":
        keys.right = true;
        break;
      case "ArrowLeft":
      case "e":
        keys.left = true;
        break;
      case "a":
        keys.thrustLeft = true;
        break;
      case "d":
        keys.thrustRight = true;
        break;
    }
  });

  window.addEventListener("keyup", (event) => {
    console.log(event.key);
    switch (event.key) {
      case "ArrowUp":
      case "w":
        keys.up = false;
        break;
      case "ArrowRight":
      case "q":
        keys.right = false;
        break;
      case "ArrowLeft":
      case "e":
        keys.left = false;
        break;
      case "a":
        keys.thrustLeft = false;
        break;
      case "d":
        keys.thrustRight = false;
        break;
    }
  });

  window.requestAnimationFrame(animate);
}

main();
