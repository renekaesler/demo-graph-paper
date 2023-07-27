export const draw = (drawingStatements, canvas) => {
  const ctx = canvas.getContext("2d", { alpha: false });

  const resize = () => {
    const { clientWidth, clientHeight } = canvas;

    if (clientWidth !== canvas.width || clientHeight !== canvas.height) {
      canvas.width = clientWidth;
      canvas.height = clientHeight;
    }
  };

  const animationLoop = elapsed => {
    resize();

    ctx.resetTransform();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawingStatements({ ctx, elapsed });

    requestAnimationFrame(animationLoop);
  };

  requestAnimationFrame(animationLoop);
};
