export const enablePan = el => {
  let isPanning = false;
  let lastPosition = [0, 0];

  const dispatch = (type, detail) => {
    const event = new CustomEvent(type, { detail });
    el.dispatchEvent(event);
  };

  const listeners = Object.entries({
    pointerdown(e) {
      e.target.setPointerCapture(e.pointerId);

      isPanning = true;
      lastPosition = [e.clientX, e.clientY];

      dispatch("panstart");
    },

    pointermove(e) {
      if (!isPanning) return;

      dispatch("pan", {
        movementX: e.clientX - lastPosition[0],
        movementY: e.clientY - lastPosition[1],
      });

      lastPosition = [e.clientX, e.clientY];
    },

    pointerup() {
      isPanning = false;

      dispatch("panend");
    },
  });

  for (const [type, listener] of listeners) {
    el.addEventListener(type, listener, { passive: true });
  }
};
