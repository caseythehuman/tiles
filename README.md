# tiles
Blueprint exports of tiled regions based on patterns of tiling and gaps between tiles.

This is purpose built for my own construction needs and is decidedly hacky.
Probably don't use this. 🤷‍♂️😃

## What it does

You define a wall or floor region as a polygon — a flat array of `[x, y]` coordinate pairs measured in millimeters (e.g. the four corners of an irregular wall section). The tool then:

1. **Computes the bounding box** of the polygon to know where to start placing tiles.
2. **Fills the region with tiles** using configurable tile width, height, and grout gap. Every other row is offset by half a tile width (subway/brick pattern).
3. **Filters tiles** using a point-in-polygon test — only tiles that have at least one corner inside the polygon are rendered, so tiles entirely outside the wall are skipped.
4. **Detects edge intersections** between each tile's sides and the polygon's edges and marks the intersection points in red — these are the cut lines.
5. **Labels each tile** with its real-world x/y coordinates (in mm) so you know exactly where each tile sits and how to cut it.
6. **Saves the layout** as JSON to `localStorage` after each tile is processed.

The result is a browser canvas (powered by [Konva.js](https://konvajs.org/)) you can read directly as a cutting guide during construction.

## How to run

```
npm install
npm start
```

Edit the polygon vertices, tile dimensions, and grout gap in `src/index.js`:

```js
let verticesArray = [40, 80, 539, 200, 848, 860, 200, 1854]; // polygon corners in mm
fillWallWithTiles(wall, 200, 65, 1.6);                        // (polygon, tileWidth, tileHeight, gap) in mm
```

## TODO (remaining work to make it fully useful for construction)

- [ ] **Dynamic canvas size** — set the stage width/height based on the polygon's bounding box instead of defaulting to the browser window size.
- [ ] **Wire up `offsetPolygon.js`** — the file exists but is never imported. It needs to be connected so the polygon boundary is inset by the grout gap before intersection checks, ensuring tiles that nearly touch the edge are not missed.
- [ ] **Cut-tile polygon generation** — once offset-polygon intersections are found, construct new closed polygons representing the actual shape of each cut tile so they can be rendered and measured precisely.
- [ ] **Per-tile intersection check** — add a function called for every tile that detects whether any of the tile's edges cross the (offset) polygon boundary, and flags those tiles for cutting.
- [ ] **Full corner-inside check** — walk all four corners of a tile: corners outside the polygon should be clipped off; tiles with zero corners inside should be dropped entirely.
- [ ] **Fix hardcoded right-edge boundary** — the row-wrap condition uses `x >= 800` instead of `polygon.attrs.extremes.rightmost[0]`, which breaks for polygons of different widths.
- [ ] **Round coordinates to 1 decimal place** — coordinates are currently full floating-point; rounding to 0.1 mm is more than sufficient for construction and keeps labels readable.
- [ ] **Export / print the blueprint** — add a way to export the finished canvas as a PDF or image so it can be printed at 1:1 scale and used as a physical template on site.
