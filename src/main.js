import GUI from "lil-gui";

import { draw } from "./canvas";
import GraphPaper from "./graph-paper";
import { enablePan } from "./pan";

const state = {
  autoZoom: true,
  scale: 1.005,
  color: [1, 0.4, 0.4],
  unitGrid: 5,
};

const canvas = document.querySelector("canvas");
const graphPaper = new GraphPaper(state.unitGrid);

const gui = new GUI();
gui.add(state, "unitGrid", 1, 20, 1);
gui.add(state, "scale", 0.95, 1.05);
gui.addColor(state, "color");

enablePan(canvas);
canvas.addEventListener("panstart", () => (state.autoZoom = false));
canvas.addEventListener("panend", () => (state.autoZoom = true));
canvas.addEventListener("pan", ({ detail }) => {
  graphPaper.translate([detail.movementX, detail.movementY]);
});

draw(context => {
  graphPaper.color = state.color;
  graphPaper.unitGrid = state.unitGrid;

  if (state.autoZoom) {
    graphPaper.zoom(state.scale, [
      canvas.clientWidth / 2,
      canvas.clientHeight / 2,
    ]);
  }

  graphPaper.draw(context);
}, canvas);
