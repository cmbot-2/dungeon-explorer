import assert from 'node:assert/strict';
import test from 'node:test';
import { createRun, moveInRun, waitInRun } from '../.test-build/run.js';
import { move } from '../.test-build/dungeon.js';

test('each successful step and wait spends one turn without mutating earlier state', () => {
  const start = createRun('forest-light');
  const snapshot = structuredClone(start);
  const direction = ['up', 'down', 'left', 'right'].find((key) => move(start.dungeon.tiles, start.player, key) !== start.player);
  const moved = moveInRun(start, direction);
  assert.equal(moved.turns, 1);
  assert.notDeepEqual(moved.player, start.player);
  const waited = waitInRun(moved);
  assert.equal(waited.turns, 2);
  assert.deepEqual(waited.player, moved.player);
  assert.deepEqual(waited.explored, moved.explored);
  assert.deepEqual(waited.visible, moved.visible);
  assert.deepEqual(start, snapshot);
  assert.deepEqual(createRun(start.seed), snapshot);
});

test('blocked moves are free and a completed run ignores all actions', () => {
  let run = createRun('forest-light');
  while (move(run.dungeon.tiles, run.player, 'up') !== run.player) run = moveInRun(run, 'up');
  const before = run;
  for (let index = 0; index < 10; index++) run = moveInRun(run, 'up');
  assert.equal(run, before);
  const finished = { ...run, finished: true };
  assert.equal(waitInRun(finished), finished);
  for (const key of ['up', 'down', 'left', 'right']) assert.equal(moveInRun(finished, key), finished);
});
