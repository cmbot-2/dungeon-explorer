export type Position = { x: number; y: number };
export type Direction = 'up' | 'down' | 'left' | 'right';
type Room = Position & { width: number; height: number };
export type Dungeon = { tiles: string[]; start: Position; exit: Position; rooms: Room[] };

function randomFor(seed: string) {
  let state = 2166136261;
  for (let index = 0; index < seed.length; index++) {
    state = Math.imul(state ^ seed.charCodeAt(index), 16777619);
  }
  return (min: number, max: number) => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return min + Math.floor(((value ^ (value >>> 14)) >>> 0) / 4294967296 * (max - min + 1));
  };
}

export function generateDungeon(seed: string): Dungeon {
  const random = randomFor(seed);
  const grid = Array.from({ length: 17 }, () => Array<string>(25).fill('#'));
  // Separate room slots leave a solid outer border and space for corridors.
  const slots = [{ x: 1, y: 1 }, { x: 14, y: 1 }, { x: 14, y: 10 }, { x: 1, y: 10 }];
  const rooms = slots.map((slot) => {
    const width = random(4, 8);
    const height = random(3, 5);
    const room = { x: slot.x + random(0, 10 - width), y: slot.y + random(0, 6 - height), width, height };
    for (let y = room.y; y < room.y + height; y++) {
      for (let x = room.x; x < room.x + width; x++) grid[y]![x] = '.';
    }
    return room;
  });
  const centers = rooms.map((room) => ({ x: room.x + Math.floor(room.width / 2), y: room.y + Math.floor(room.height / 2) }));
  // Each room connects to the previous one, so every carved tile is reachable.
  for (let index = 1; index < centers.length; index++) {
    const cursor = { ...centers[index - 1]! };
    const end = centers[index]!;
    const axes = random(0, 1) ? ['x', 'y'] as const : ['y', 'x'] as const;
    for (const axis of axes) {
      while (cursor[axis] !== end[axis]) {
        cursor[axis] += Math.sign(end[axis] - cursor[axis]);
        grid[cursor.y]![cursor.x] = '.';
      }
    }
  }
  for (const room of rooms) grid[room.y]![room.x] = 'L';
  const start = centers[0]!;
  const exit = centers.at(-1)!;
  grid[start.y]![start.x] = '@';
  grid[exit.y]![exit.x] = 'E';
  return { tiles: grid.map((row) => row.join('')), start, exit, rooms };
}

export function move(tiles: readonly string[], position: Position, direction: Direction): Position {
  const offsets: Record<Direction, Position> = {
    up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
    left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
  };
  const offset = offsets[direction];
  const next = { x: position.x + offset.x, y: position.y + offset.y };
  const tile = tiles[next.y]?.[next.x];
  return tile && tile !== '#' ? next : position;
}
