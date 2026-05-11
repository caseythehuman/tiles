export function offsetPolygon(points, distance, angle) {
  // Create an empty array to store the offset points
  const offsetPoints = [];

  // Loop through each point in the array
  for (let i = 0; i < points.length; i++) {
    // Get the current point and the next point
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];

    // Calculate the angle between the two points using the arctangent function
    // This is the angle of the line connecting the two points, measured from the positive x-axis.
    const theta = Math.atan2(p2.y - p1.y, p2.x - p1.x);

    // Calculate the offset for the current point using the angle and distance
    // The offset is added to the point's coordinates to get the new point
    const offsetX = distance * Math.cos(theta + angle);
    const offsetY = distance * Math.sin(theta + angle);

    // Add the offset point to the array
    offsetPoints.push({ x: p1.x + offsetX, y: p1.y + offsetY });
  }

  // Return the array of offset points
  return offsetPoints;
}
