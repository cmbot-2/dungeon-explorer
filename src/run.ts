import { generateDungeon, move } from './dungeon.js';
import type { Direction, Dungeon, Position } from './dungeon.js';

export type Run = { seed: string; dungeon: Dungeon; player: Position; finished: boolean };

export function createRun(seed: string): Run {
  const dungeon = generateDungeon(seed);
  return { seed, dungeon, player: { ...dungeon.start }, finished: false };
}

export function moveInRun(run: Run, direction: Direction): Run {
  if (run.finished) return run;
  const player = move(run.dungeon.tiles, run.player, direction);
  if (player === run.player) return run;
  const finished = player.x === run.dungeon.exit.x && player.y === run.dungeon.exit.y;
  return { ...run, player, finished };
}
