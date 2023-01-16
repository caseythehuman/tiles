import { Line } from "konva";

export function drawPolygon(vertices) {
  // Create a new Polygon shape
  var polygon = new Line({
    points: vertices,
    fill: "pink",
    stroke: "black",
    strokeWidth: 1,
    closed: true
    //draggable: true
  });
  return polygon;
}
