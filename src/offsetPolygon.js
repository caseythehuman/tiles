function offsetPolygon(points, distance, angle) {
  const offsetPoints = [];
  for (var k = 0; k < 3; k++) {
    console.log("k: %k", k);
  }

  for (let i = 0; i < points.length; i++) {
    // Get the current point and the next point
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const theta = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const offsetX = distance * Math.cos(theta + angle);
    const offsetY = distance * Math.sin(theta + angle);
    offsetPoints.push({ x: p1.x + offsetX, y: p1.y + offsetY });
  }

  // Return the array of offset points
  return offsetPoints;
}
