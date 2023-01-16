import { Stage, Layer, Rect, Text } from "konva";
import { scale } from "./index";
import { checkCornersPushToLayer } from "./checkCornersPushToLayer";
import { flagCorners } from "./flagCorners";
import { isPointInsidePolygon } from "./isPointInsidePolygon";

export function fillWallWithTiles(polygon, tileWidth, tileHeight, gap) {
  //TODO Set the dimensions of the canvas based on the polygon's points
  const stage = new Stage({
    container: document.getElementById("app"),
    width: 3000, //window.innerWidth,
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
  //layer.add(testRect);
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
  while (y < 100) {
    // Check if the current position is inside the polygon
    counterY++;
    if (x < 800) {
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
        fontSize: 8,
        fill: "black",
        text: `x:${x} y:${y}`
      });

      let preservedCorners = tile.attrs.points; 
      for (let k =0; k< tile.attrs.points.length; k+=2){
        if (isPointInsidePolygon(polygon, tile.attrs.points[k], tile.attrs.points[k+1])){
          preservedCorners[k] = tile.attrs.points[k];
          preservedCorners[k+1] = tile.attrs.points[k+1];
        } 

      };



      flagCorners(tile, polygon);

      //each one of these should push to an array if true in their proper place in the array to be made into a line. It doesn't matter as long as they're in order, how do you do that for notches?
     
      checkCornersPushToLayer(tile, polygon, text);
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


