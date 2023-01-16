import { isPointInsidePolygon } from "./isPointInsidePolygon";

export function checkCornersPushToLayer(tile, polygon, text) {
    if (isPointInsidePolygon(polygon.attrs.points, tile.attrs.x, tile.attrs.y) ||
        isPointInsidePolygon(
            polygon.attrs.points,
            tile.attrs.x,
            tile.attrs.y + tile.attrs.height
        ) ||
        isPointInsidePolygon(
            polygon.attrs.points,
            tile.attrs.x + tile.attrs.width,
            tile.attrs.y
        ) ||
        isPointInsidePolygon(
            polygon.attrs.points,
            tile.attrs.x + tile.attrs.width,
            tile.attrs.y + tile.attrs.height
        )) {
        polygon.getParent().add(tile);
        polygon.getParent().add(text);
    }
}
