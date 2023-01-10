import { Stage, Layer, Rect, Line, Text } from "konva";
//polygon corners for the wall or floor (in pixels, but also millimeters)
let verticesArray = [0, 0, 839, 0, 848, 1860, 0, 1854];

function trimRect(rect) {
  const pointsOfRect = rect.points;
  return pointsOfRect;
}

//random shape maker for testing
//let verticesArray = [0, 0, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000];
const wall = drawPolygon(verticesArray);

//zoom of stage
let scale = 0.3;

fillWallWithTiles(wall, 200, 65, 1.6);

//do lines intersect? use this to find all intersections of polygon and tiles.
//TODO make function to offset polygon line toward tile the distance of a groutline
//TODO find intersections of offsetPolygoneBoundaryByGap and tile, then make a new pulygon that will represent a cut tile from those points
//TODO function that is called as each tile is produced to see if any of its lines intersect with the polygon (bug? should I offset the polugon in to start with so that tiles that come near to but not touch the polygon are detected? Yes! will catch uncut tiles on the edge that would be a pain in the ass)
//TODO function that checks to see if some part of the tile is inside the polygon
//just walk over the points of the tile with this and if a corner fails we can cut it off. If all fail the tile shouldn't get pushed to parent

//midpoint formula
//const midpoint = ([x1, y1], [x2, y2]) => [(x1 + x2) / 2, (y1 + y2) / 2];
//const mid = midpoint([150,50],[0,0]);
//console.log(mid);

function getSlopeAngle(s1, s2) {
  return (Math.atan((s2[1] - s1[1]) / (s2[0] - s1[0])) * 180) / Math.PI;
}

//console.log(getSlopeAngle([0, 0], [2, 3]));
// 56.309932474020215

//TODO unfuck that while loop that controls the tile placement
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  let denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    console.log("lines are parallel");
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
    //draggable: true
  });
  //console.log("This one:", polygon);
  return polygon;
}

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

  const testRect = new Rect({
    x: 839.33,
    y: 68.19999999999999,
    width: 800,
    height: 200,
    fill: "blue",
    stroke: "black",
    strokeWidth: 1
    //points: [testRect.x(),0,0,0,0,0,0,0]
  });

  //console.log(testRect.attrs.points[0]);

  // Add the polygon to the layer
  layer.add(polygon);
  layer.add(testRect);
  // Add the layer to the stage
  stage.add(layer);

  //testRect.intersects(0,0,0,0);

  stage.batchDraw();
  // Initialize the x and y coordinates of the FIRST tile, top left right now

  var x = gap;
  var y = gap;
  var rowCount = 0;

  var counterY = 0;

  // Keep placing tiles until the polygon is filled
  while (y < 200) {
    // Check if the current position is inside the polygon

    counterY++;
    if (x < 900) {
      var tile = new Rect({
        x: x,
        y: y,
        width: tileWidth,
        height: tileHeight,
        fill: "transparent",
        stroke: "black",
        strokeWidth: 1,
        points: [
          x,
          y,
          x + tileWidth,
          y,
          x + tileWidth,
          y + tileHeight,
          x,
          y + tileHeight
        ]
      });
      //console.log(tile.attrs.points);
      var text = new Text({
        x: x + tileWidth / 3,
        y: y + tileHeight / 3,
        fontSize: 30,
        fill: "black"
        //text: `x:${x} y:${y}`
      });
      for (let i = 0; i < 8; i += 2) {
        for (let j = 0; j < 8; j += 2) {
          var intersection = intersect(
            verticesArray[i],
            verticesArray[i + 1],
            verticesArray[i + 2],
            verticesArray[i + 3],
            tile.attrs.points[j],
            tile.attrs.points[j + 1],
            tile.attrs.points[j + 2],
            tile.attrs.points[j + 3]
          );
          if (intersection.x) {
            //console.log(intersection);
            let intersectionPoint = new Rect({
              x: intersection.x,
              y: intersection.y,
              height: 15,
              width: 30,
              fill: "red"
            });

            polygon.getParent().add(intersectionPoint);
          }
        }
      }
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
    if (x >= 1200) {
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
