import { Stage, Layer, Rect, Line } from "konva";

function drawPolygon(vertices) {
  // Create a new Polygon shape
  var polygon = new Line({
    points: vertices,
    fill: "pink",
    stroke: "black",
    strokeWidth: 2,
    closed: true
  });
  return polygon;
}
//polygon corners for the wall or floor
const verticesArray = [0, 0, 1000, 0, 1000, 2000, 500, 2000, 500, 500, 0, 500];

const wall = drawPolygon(verticesArray);

fillWallWithTiles(wall, 200, 100, 10);

function fillWallWithTiles(polygon, tileWidth, tileHeight, gap) {
  //TODO Set the dimensions of the canvas based on the polygon's points

  const stage = new Stage({
    container: document.getElementById("app"),
    width: 2000,
    height: 2000
  });
  stage.scale({ x: 0.5, y: 0.5 });

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
      //counterY += tileHeight + gap;
      // Add the tile to the polygon's parent group
      polygon.getParent().add(tile);
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
}
