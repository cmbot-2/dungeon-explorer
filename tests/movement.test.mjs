import assert from 'node:assert/strict';
import test from 'node:test';
import { generateDungeon, move } from '../.test-build/dungeon.js';

test('seeds reproduce their maps and different seeds create varied layouts', () => {
  const seeds = ['', 'forest-light', '0', '🌲', ...Array.from({ length: 250 }, (_, i) => String(i))];
  for (const seed of seeds) assert.deepEqual(generateDungeon(seed), generateDungeon(seed));
  assert(new Set(seeds.map((seed) => generateDungeon(seed).tiles.join('\n'))).size > 240);
});

test('all rooms and the exit are reachable across 250 seeds; walls and borders block movement', () => {
  const directions = ['up', 'down', 'left', 'right'];
  const deltas = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  for (let seed = 0; seed < 250; seed++) {
    const { tiles, start, exit, rooms } = generateDungeon(String(seed));
    assert.equal(rooms.length, 4);
    assert.equal(tiles.length, 17);
    assert(tiles.every((row) => row.length === 25 && row[0] === '#' && row.at(-1) === '#'));
    assert.equal(tiles[0], '#'.repeat(25));
    assert.equal(tiles.at(-1), '#'.repeat(25));
    assert.equal(tiles.join('').split('@').length - 1, 1);
    assert.equal(tiles.join('').split('E').length - 1, 1);
    const queue = [start];
    const visited = new Set([`${start.x},${start.y}`]);
    for (const position of queue) {
      directions.forEach((direction, index) => {
        const [dx, dy] = deltas[index];
        const tile = tiles[position.y + dy]?.[position.x + dx];
        const next = move(tiles, position, direction);
        if (!tile || tile === '#') assert.deepEqual(next, position);
        else {
          assert.deepEqual(next, { x: position.x + dx, y: position.y + dy });
          const key = `${next.x},${next.y}`;
          if (!visited.has(key)) { visited.add(key); queue.push(next); }
        }
      });
    }
    assert(visited.has(`${exit.x},${exit.y}`), `exit for seed ${seed}`);
    assert.equal(visited.size, tiles.join('').replaceAll('#', '').length, `all floor tiles for seed ${seed}`);
    assert.deepEqual(move(tiles, { x: 0, y: 0 }, 'left'), { x: 0, y: 0 });
    assert.deepEqual(move(tiles, { x: 0, y: 0 }, 'up'), { x: 0, y: 0 });
  }
});
