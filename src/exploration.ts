import type { Position } from './dungeon.js';

export const sightRadius = 3;
export const tileKey = ({ x, y }: Position): string => `${x},${y}`;

// A diamond of nearby tiles, including walls; this is not line-of-sight casting.
export function visibleTiles(tiles: readonly string[], player: Position): ReadonlySet<string> {
  const visible = new Set<string>();
  for (let y = Math.max(0, player.y - sightRadius); y <= Math.min(tiles.length - 1, player.y + sightRadius); y++) {
    const reach = sightRadius - Math.abs(y - player.y);
    for (let x = Math.max(0, player.x - reach); x <= Math.min(tiles[y]!.length - 1, player.x + reach); x++) {
      visible.add(tileKey({ x, y }));
    }
  }
  return visible;
}
