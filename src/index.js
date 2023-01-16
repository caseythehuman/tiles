import log from "log.js";
import { drawPolygon } from "./drawPolygon";
import { fillWallWithTiles } from "./fillWallWithTiles";
import trimRect from "./trimRect";
//polygon corners for the wall or floor (in pixels, but also millimeters)
export let verticesArray = [10, 10, 539, 10, 848, 1860, 0, 1854];

log("log.js is a shortened console.log and it shows how to use export to clean this shit up.");

//random shape maker for testing
//let verticesArray = [0, 0, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000, Math.random()*10000];
const wall = drawPolygon(verticesArray);

//TODO make function to offset polygon line toward tile the distance of a groutline (or just offset on a per tile basis to eliminate weird corner behavior)
//TODO find intersections of offsetPolygoneBoundaryByGap and tile, then make a new pulygon that will represent a cut tile from those points
//TODO function that is called as each tile is produced to see if any of its lines intersect with the polygon (bug? should I offset the polugon in to start with so that tiles that come near to but not touch the polygon are detected? Yes! will catch uncut tiles on the edge that would be a pain in the ass)
//TODO function that checks to see if some part of the tile is inside the polygon
//just walk over the points of the tile with this and if a corner fails we can cut it off. If all fail the tile shouldn't get pushed to parent
//midpoint formula
//const midpoint = ([x1, y1], [x2, y2]) => [(x1 + x2) / 2, (y1 + y2) / 2];
//const mid = midpoint([150,50],[0,0]);
//console.log(mid);

//zoom of stage
export let scale = 2.5;

fillWallWithTiles(wall, 200, 65, 1.6);