import Drawing from "dxf-writer";

/**
 * Build and download a DXF file from the tile layout data.
 *
 * Layers:
 *   WALL       (green)  — the wall/floor polygon outline
 *   TILES      (white)  — all tile rectangles that are inside the polygon
 *   CUT_LINES  (red)    — cut lines across edge tiles (line between the two
 *                         points where the wall boundary crosses a tile)
 *
 * @param {number[]} wallVertices  Flat [x1,y1,x2,y2,...] polygon vertices in mm.
 * @param {Array<{x:number,y:number,width:number,height:number}>} tiles
 *   Every tile rectangle that was rendered.
 * @param {Array<{x1:number,y1:number,x2:number,y2:number}>} cutSegments
 *   Cut lines: one segment per tile that crosses the wall boundary
 *   (connecting the two intersection points on that tile's edges).
 */
export function exportDxf(wallVertices, tiles, cutSegments) {
  const d = new Drawing();
  d.setUnits("Millimeters");

  d.addLayer("WALL", Drawing.ACI.GREEN, "CONTINUOUS");
  d.addLayer("TILES", Drawing.ACI.WHITE, "CONTINUOUS");
  d.addLayer("CUT_LINES", Drawing.ACI.RED, "CONTINUOUS");

  // ── Wall polygon ───────────────────────────────────────────────────────────
  d.setActiveLayer("WALL");
  const wallPts = [];
  for (let i = 0; i < wallVertices.length; i += 2) {
    wallPts.push([wallVertices[i], wallVertices[i + 1]]);
  }
  // Close back to first point so the polygon is explicitly closed in the DXF
  wallPts.push([wallVertices[0], wallVertices[1]]);
  d.drawPolyline(wallPts, true);

  // ── Tile rectangles ────────────────────────────────────────────────────────
  d.setActiveLayer("TILES");
  for (const tile of tiles) {
    d.drawRect(tile.x, tile.y, tile.x + tile.width, tile.y + tile.height);
  }

  // ── Cut lines ──────────────────────────────────────────────────────────────
  d.setActiveLayer("CUT_LINES");
  for (const seg of cutSegments) {
    d.drawLine(seg.x1, seg.y1, seg.x2, seg.y2);
  }

  return d.toDxfString();
}

/**
 * Trigger a browser download of the given DXF content.
 * @param {string} dxfString
 * @param {string} [filename]
 */
export function downloadDxf(dxfString, filename = "tile-layout.dxf") {
  const blob = new Blob([dxfString], { type: "application/dxf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
