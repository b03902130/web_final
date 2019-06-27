function motionDetection(ctx, sample_size) {
  let motion = [];
  const w = 350;
  const h = 350;
  let data = ctx.getImageData(0, 0, w, h).data;
  ctx.background(0);
  for (var y = 0; y < h; y += sample_size) {
    for (var x = 0; x < w; x += sample_size) {
      let pos = (x + y * w) * 4;
      let r = data[pos];
      let g = data[pos + 1];
      let b = data[pos + 2];
      ctx.drawImage(video, 0, 0, w, h);
      let data = ctx.getImageData(0, 0, w, h).data;
      ctx.background(0);
  for (var y = 0; y < h; y += sample_size) {
    for (var x = 0; x < w; x += sample_size) {
      var pos = (x + y * w) * 4;
      var r = data[pos];
      var g = data[pos + 1];
      var b = data[pos + 2];
      if (
        previous_frame[pos] &&
        Math.abs(previous_frame[pos] - r) > threshold
      ) {
        motion.push({ x: x, y: y, r: r, g: g, b: b });
      }
      previous_frame[pos] = r;
    }
  }
  return motion;
}
