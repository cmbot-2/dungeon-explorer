import assert from 'node:assert/strict';
import test from 'node:test';
import { move, room, spawn } from '../.test-build/dungeon.js';

test('every open tile is reachable and every move respects walls and bounds', () => {
  const directions = ['up', 'down', 'left', 'right'];
  const deltas = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  const start = spawn();
  const queue = [start];
  const visited = new Set([`${start.x},${start.y}`]);
  for (const position of queue) {
    directions.forEach((direction, index) => {
      const [dx, dy] = deltas[index];
      const tile = room[position.y + dy]?.[position.x + dx];
      const next = move(position, direction);
      if (!tile || tile === '#') {
        assert.deepEqual(next, position);
      } else {
        assert.deepEqual(next, { x: position.x + dx, y: position.y + dy });
        const key = `${next.x},${next.y}`;
        if (!visited.has(key)) { visited.add(key); queue.push(next); }
      }
    });
  }
  const openTiles = room.join('').replaceAll('#', '').length;
  assert.equal(visited.size, openTiles);
  assert.deepEqual(move({ x: 0, y: 0 }, 'left'), { x: 0, y: 0 });
  assert.deepEqual(move({ x: 0, y: 0 }, 'up'), { x: 0, y: 0 });
  assert.deepEqual(spawn(), start, 'exploration does not mutate the spawn');
});
