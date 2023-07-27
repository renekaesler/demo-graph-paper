const color2rgb = (color, alpha = 1) => color
  .map(c => 1 - alpha + alpha * c)
  .map(c => c * 255);

export default class GraphPaper {
  #scale = 1;
  #offset = [0, 0];

  get #maxOffset() {
    return this.unitGrid * 20;
  }

  constructor(unitGrid = 5) {
    this.unitGrid = unitGrid;
    this.color = [0, 0, 0];
  }

  view2world = coord => [
    (coord[0] - this.#offset[0]) / this.#scale,
    (coord[1] - this.#offset[1]) / this.#scale,
  ];

  world2view = coord => [
    coord[0] * this.#scale + this.#offset[0],
    coord[1] * this.#scale + this.#offset[1],
  ];

  translate = distance => {
    const unitSize = this.#maxOffset * this.#scale;

    // offset normalizaion
    this.#offset[0] = (this.#offset[0] + distance[0]) % unitSize;
    this.#offset[1] = (this.#offset[1] + distance[1]) % unitSize;
  };

  zoom = (factor, point) => {
    const origin = this.view2world(point);
    this.#scale *= factor;
    const newPoint = this.world2view(origin);

    // scale normalization
    this.#scale /= Math.pow(2, Math.floor(Math.log2(this.#scale)));

    this.translate([point[0] - newPoint[0], point[1] - newPoint[1]]);
  };

  draw = ({ ctx }) => {
    ctx.translate(...this.#offset);
    ctx.scale(this.#scale, this.#scale);

    const t = this.#scale % 1;
    this.#drawGrid(ctx, { alpha: 0.2 * t,       gutter: 1,  skip: [2, 5] });
    this.#drawGrid(ctx, { alpha: 0.2,           gutter: 2,  skip: [5] });
    this.#drawGrid(ctx, { alpha: 0.5 * t,       gutter: 5,  skip: [4] });
    this.#drawGrid(ctx, { alpha: 0.5 + 0.5 * t, gutter: 10, skip: [2] });
    this.#drawGrid(ctx, { alpha: 1,             gutter: 20 });
  };

  #drawGrid = (ctx, { alpha, gutter, skip = [] }) => {
    ctx.beginPath();

    const from = [
      -this.#maxOffset,
      -this.#maxOffset
    ];

    const to = [
      ctx.canvas.width / this.#scale + this.#maxOffset,
      ctx.canvas.height / this.#scale + this.#maxOffset,
    ];

    const step = gutter * this.unitGrid;
    const skipLine = idx => skip.some(line => idx % (line * step) === 0);

    for (let x = from[0]; x <= to[0]; x += step) {
      if (skipLine(x)) continue;

      ctx.moveTo(x, from[1]);
      ctx.lineTo(x, to[1]);
    }

    for (let y = from[1]; y <= to[1]; y += step) {
      if (skipLine(y)) continue;

      ctx.moveTo(from[0], y);
      ctx.lineTo(to[0], y);
    }

    ctx.save();
    ctx.resetTransform();

    ctx.strokeStyle = `rgb(${color2rgb(this.color, alpha)})`;

    ctx.stroke();
    ctx.restore();
  };
}
