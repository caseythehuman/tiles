import { Rect, Line } from "konva";
import { intersect } from "./intersect";
import { isPointInsidePolygon } from "./isPointInsidePolygon";

export function flagCorners(tile, polygon) {
    let tilePoints = [...tile.attrs.points, tile.attrs.points[0], tile.attrs.points[1],tile.attrs.points[2], tile.attrs.points[3]];
    let polygonPoints = [...polygon.attrs.points, polygon.attrs.points[0], polygon.attrs.points[1], polygon.attrs.points[2], polygon.attrs.points[3]];
    let hasIntersection = 0;
    let beenPushed = 0;
    let cutTile = new Line({
        fill: "blue",
        stroke: "green",
        strokeWidth: 4,
        closed: true,
        points: []
       });

    for (let i = 0; i < polygonPoints.length; i += 2) {
        beenPushed = 0;

        for (let j = 0; j < tilePoints.length; j += 2) {
            var intersection = intersect(
                polygonPoints[i],
                polygonPoints[i + 1],
                polygonPoints[i + 2],
                polygonPoints[i + 3],
                tilePoints[j],
                tilePoints[j + 1],
                tilePoints[j + 2],
                tilePoints[j + 3]
            );

            if (intersection.x  && !beenPushed) {
                hasIntersection = 1;
                cutTile.attrs.points.push(intersection.x, intersection.y);
                beenPushed = 1;
                
                let intersectionPoint = new Rect({
                    x: intersection.x,
                    y: intersection.y,
                    height: 15,
                    width: 15,
                    rotation: -45,
                    fill: "purple"
                });
                polygon.getParent().add(intersectionPoint);
            }

            if (isPointInsidePolygon(tile.attrs.points, polygon.attrs.points[i], polygon.attrs.points[i+1])){
                hasIntersection = 1;
                cutTile.attrs.points.push(polygon.attrs.points[i], polygon.attrs.points[i+1]);
                beenPushed = 1;
                let intersectionPoint = new Rect({
                    x: polygon.attrs.points[i], 
                    y: polygon.attrs.points[i+1],
                    height: 10,
                    width: 30,
                    rotation: 45,
                    fill: "red"
                });
                polygon.getParent().add(intersectionPoint);

            };
            
                    
            if (hasIntersection && isPointInsidePolygon(polygon.attrs.points, tile.attrs.points[j], tile.attrs.points[j+1])){
                cutTile.attrs.points.push(tile.attrs.points[j], tile.attrs.points[j+1]);
            };
        }
        console.log(cutTile.attrs.points);
        
        polygon.getParent().add(cutTile);
        //if (cutTile.attrs.points[0]){polygon.getParent().add(cutTile)};
    }
}
