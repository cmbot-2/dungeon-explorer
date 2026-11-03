import assert from 'node:assert/strict';
import test from 'node:test';
import { createRun, moveInRun } from '../.test-build/run.js';
import { move } from '../.test-build/dungeon.js';

test('a reachable exit ends the run, freezes movement, and allows a fresh replay', () => {
  for (const seed of ['forest-light', 'night-walk', '42']) {
    let run = createRun(seed);
    const original = structuredClone(run);
    const queue = [{ position: run.player, path: [] }];
    const visited = new Set([JSON.stringify(run.player)]);
    let route;
    for (const { position, path } of queue) {
      if (position.x === run.dungeon.exit.x && position.y === run.dungeon.exit.y) { route = path; break; }
      for (const direction of ['up', 'down', 'left', 'right']) {
        const next = move(run.dungeon.tiles, position, direction);
        const key = JSON.stringify(next);
        if (!visited.has(key)) { visited.add(key); queue.push({ position: next, path: [...path, direction] }); }
      }
    }
    assert(route?.length);
    for (const direction of route) {
      assert.equal(run.finished, false);
      run = moveInRun(run, direction);
    }
    assert.equal(run.finished, true);
    assert.equal(run.turns, route.length);
    assert.deepEqual(run.player, run.dungeon.exit);
    for (const direction of ['up', 'down', 'left', 'right']) assert.equal(moveInRun(run, direction), run);
    assert.deepEqual(createRun(seed), original);
  }
});
