import assert from 'node:assert/strict';
import test from 'node:test';
import { visibleTiles, tileKey } from '../.test-build/exploration.js';
import { createRun, moveInRun } from '../.test-build/run.js';

test('the lantern reveals a bounded three-step diamond including nearby walls', () => {
  const map = Array(9).fill('#########');
  const visible = visibleTiles(map, { x: 4, y: 4 });
  assert.equal(visible.size, 25);
  assert(visible.has('4,4'));
  assert(visible.has('7,4'));
  assert(visible.has('5,6'));
  assert(!visible.has('6,6'));
  assert(!visible.has('8,4'));
  assert.equal(visibleTiles(map, { x: 0, y: 0 }).size, 10);
});

test('exploration persists after leaving sight, never leaks future rooms, and resets on replay', () => {
  const initial = createRun('forest-light');
  assert.deepEqual(initial.explored, initial.visible);
  assert(!initial.explored.has(tileKey(initial.dungeon.exit)));
  const queue = [initial];
  const visited = new Set([tileKey(initial.player)]);
  let discoveredMore = false;
  let leftSight = false;
  for (const run of queue) {
    for (const direction of ['up', 'down', 'left', 'right']) {
      const next = moveInRun(run, direction);
      assert.deepEqual(next.explored, new Set([...run.explored, ...next.visible]));
      for (const key of run.explored) assert(next.explored.has(key));
      if (next.explored.size > initial.explored.size) discoveredMore = true;
      if (!next.visible.has(tileKey(initial.player))) {
        assert(next.explored.has(tileKey(initial.player)));
        leftSight = true;
      }
      const key = tileKey(next.player);
      if (!visited.has(key)) { visited.add(key); queue.push(next); }
    }
  }
  assert(discoveredMore && leftSight);
  assert.deepEqual(initial.explored, initial.visible);
  assert.deepEqual(createRun(initial.seed), initial);
  const other = createRun('another-map');
  assert.deepEqual(other.explored, other.visible);
});
