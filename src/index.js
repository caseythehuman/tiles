import { Stage, Layer, Rect, Line, Text } from "konva";

//polygon corners for the wall or floor (in pixels, but also millimeters)
const verticesArray = [0, 0, 1000, 0, 1500, 2000, 500, 2000, 500, 500, 0, 500];
const wall = drawPolygon(verticesArray);
//zoom of stage
let scale = 0.5;

fillWallWithTiles(wall, 200, 100, 10);

//do lines intersect? use this to find all intersections of polygon and tiles.
//TODO make function to offset polygon line toward tile the distance of a groutline
//TODO find intersections of offsetPolygoneBoundaryByGap and tile, then make a new pulygon that will represent a cut tile from those points
//TODO function that is called as each tile is produced to see if any of its lines intersect with the polygon (bug? should I offset the polugon in to start with so that tiles that come near to but not touch the polygon are detected? Yes! will catch uncut tiles on the edge that would be a pain in the ass)
//TODO function that checks to see if some part of the tile is inside the polygon
//just walk over the points of the tile with this and if a corner fails we can cut it off. If all fail the tile shouldn't get pushed to parent
console.log("inside", isPointInsidePolygon(verticesArray, 850, 10));
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
    closed: true
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
    width: 2000,
    height: 2000
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
        fill: null,
        stroke: "black",
        strokeWidth: 1
      });

      var text = new Text({
        x: x,
        y: y,
        fontSize: 30,
        fill: "black",
        text: `x:${x} y:${y}`
      });

      //counterY += tileHeight + gap;
      // Add the tile to the polygon's parent group
      polygon.getParent().add(tile);
      polygon.getParent().add(text);
    }

    // Move the x coordinate to the right by the width of the tile plus the gap

    x += tileWidth + gap;

    // If the x coordinate is past the right edge of the polygon, move to the next row
    if (x >= 2000) {
      rowCount++;
      //this part does the subway tile pattern
      if (rowCount % 2) {
        x = gap + tileWidth / 2;
      } else {
        x = gap;
      }
      y += tileHeight + gap;
    }
  }
}
