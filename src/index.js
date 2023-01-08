import { Stage, Layer, Rect, Line, Text } from "konva";

//polygon corners for the wall or floor (in pixels, but also millimeters)
let verticesArray = [
  100,
  100,
  1000,
  40,
  1500,
  2000,
  500,
  2000,
  500,
  500,
  100,
  500
];

//random shape maker for testing
//let verticesArray = [0, 0, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000];
const shiftX = 10;
const shiftY = 10;

function shiftPolygon(polygonPoints, xDistance, yDistance) {
  let i;
  while (i < polygonPoints.length) {
    polygonPoints[i] = polygonPoints[i] + xDistance;
    i++;
    polygonPoints[i] = polygonPoints[i] + yDistance;
    i++;
  }
  return polygonPoints;
  console.log("polypouints", polygonPoints);
}

const shiftedPolygon = verticesArray;
console.log("shifted", shiftPolygon);

const wall = drawPolygon(verticesArray);
//zoom of stage
let scale = 0.3;

fillWallWithTiles(wall, 400, 100, 10);

//do lines intersect? use this to find all intersections of polygon and tiles.
//TODO make function to offset polygon line toward tile the distance of a groutline
//TODO find intersections of offsetPolygoneBoundaryByGap and tile, then make a new pulygon that will represent a cut tile from those points
//TODO function that is called as each tile is produced to see if any of its lines intersect with the polygon (bug? should I offset the polugon in to start with so that tiles that come near to but not touch the polygon are detected? Yes! will catch uncut tiles on the edge that would be a pain in the ass)
//TODO function that checks to see if some part of the tile is inside the polygon
//just walk over the points of the tile with this and if a corner fails we can cut it off. If all fail the tile shouldn't get pushed to parent

//TODO unfuck that while loop that controls the tile placement
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  let denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return { x, y };
}

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect

// Check if a point is inside a polygon
function isPointInsidePolygon(vertices, x, y) {
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

function drawPolygon(vertices) {
  // Create a new Polygon shape
  var polygon = new Line({
    points: vertices,
    fill: "pink",
    stroke: "black",
    strokeWidth: 2,
    closed: true,
    draggable: true
  });
  //console.log("This one:", polygon);
  return polygon;
}

console.log("wallpoints;", wall.getPoints());
console.log(intersect(0, 0, 100, 100, 0, 100, 100, 0));
console.log(wall.getPoints());

function fillWallWithTiles(polygon, tileWidth, tileHeight, gap) {
  //TODO Set the dimensions of the canvas based on the polygon's points

  const stage = new Stage({
    container: document.getElementById("app"),
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: false,
    pos: 1000
  });
  stage.scale({ x: scale, y: scale });

  const layer = new Layer();
  stage.add(layer);

  // Add the polygon to the layer
  layer.add(polygon);

  // Add the layer to the stage
  stage.add(layer);

  stage.batchDraw();
  // Initialize the x and y coordinates of the FIRST tile, top left right now

  var x = gap;
  var y = gap;
  var rowCount = 0;

  var counterY = 0;

  // Keep placing tiles until the polygon is filled
  while (y < 2000) {
    // Check if the current position is inside the polygon

    counterY++;
    if (x < 2000) {
      //isPointInsidePolygon(points, x, y)) {
      // Create a new tile at the current position
      var tile = new Rect({
        x: x,
        y: y,
        width: tileWidth,
        height: tileHeight,
        fill: "transparent",
        stroke: "black",
        strokeWidth: 1
      });

      var text = new Text({
        x: x + tileWidth / 3,
        y: y + tileHeight / 3,
        fontSize: 30,
        fill: "black",
        text: `x:${x} y:${y}`
      });

      //counterY += tileHeight + gap;
      // Add the tile to the polygon's parent group
      //console.log(tile);
      //console.log("x:", tile.attrs.x)
      //console.log("inside", isPointInsidePolygon(verticesArray, tile.attrs.x, tile.attrs.y));
      //checks if x-y pair is in polygon before pushing to parent.
      //TODO check all corners. xy,x-y+height,x+width-y, x+width-y+height

      if (
        isPointInsidePolygon(verticesArray, tile.attrs.x, tile.attrs.y) ||
        isPointInsidePolygon(
          verticesArray,
          tile.attrs.x,
          tile.attrs.y + tile.attrs.height
        ) ||
        isPointInsidePolygon(
          verticesArray,
          tile.attrs.x + tile.attrs.width,
          tile.attrs.y
        ) ||
        isPointInsidePolygon(
          verticesArray,
          tile.attrs.x + tile.attrs.width,
          tile.attrs.y + tile.attrs.height
        )
      ) {
        polygon.getParent().add(tile);
        polygon.getParent().add(text);
      }
    }

    // Move the x coordinate to the right by the width of the tile plus the gap

    x += tileWidth + gap;

    // If the x coordinate is past the right edge of the polygon, move to the next row
    if (x >= 2000) {
      rowCount++;
      //this part does the subway tile pattern
      if (rowCount % 2) {
        x = -tileWidth / 2;
      } else {
        x = gap;
      }
      y += tileHeight + gap;
    }
  }
}
const offsetArray = offsetPolygon(verticesArray, 20, 90);
console.log(offsetArray);
/**
 * Offsets a closed polygon represented by an array of points by a given distance and angle.
 *
 * @param {Array} points - An array of points representing a closed polygon. Each point should have an `x` and `y` property.
 * @param {number} distance - The distance to offset the polygon.
 * @param {number} angle - The angle in radians to offset the polygon.
 * @return {Array} A new array of points representing the original polygon with the offset applied.
 */
function offsetPolygon(points, distance, angle) {
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
