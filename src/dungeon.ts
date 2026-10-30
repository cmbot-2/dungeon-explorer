export const room = [
  '#################',
  '#.......#.......#',
  '#..L....#....L..#',
  '#.......#.......#',
  '#..@............#',
  '#.......#.......#',
  '####.####.......#',
  '#.......#.......#',
  '#..L............#',
  '#.......#.......#',
  '#################',
] as const;

export type Position = { x: number; y: number };
export type Direction = 'up' | 'down' | 'left' | 'right';

export function spawn(): Position {
  const y = room.findIndex((row) => row.includes('@'));
  return { x: room[y]!.indexOf('@'), y };
}

export function move(position: Position, direction: Direction): Position {
  const offsets: Record<Direction, Position> = {
    up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
    left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
  };
  const offset = offsets[direction];
  const next = { x: position.x + offset.x, y: position.y + offset.y };
  const tile = room[next.y]?.[next.x];
  return tile && tile !== '#' ? next : position;
}
