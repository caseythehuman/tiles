// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
// Check if a point is inside a polygon
export function isPointInsidePolygon(vertices, x, y) {
  // Initialize a counter for the number of intersections
  var count = 0;

  // Iterate through the vertices
  for (var i = 0; i < vertices.length; i += 2) {
    var x1 = vertices[i];
    var y1 = vertices[i + 1];
    var x2 = vertices[(i + 2) % vertices.length];
    var y2 = vertices[(i + 3) % vertices.length];

    // Check if the point is on the same side of the edge as the vertex
    if (y > y1 !== y > y2 && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
      count++;
    }
  }

  // Return true if the number of intersections is odd
  return count % 2 === 1;
}
