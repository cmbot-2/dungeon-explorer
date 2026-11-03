import { generateDungeon, move } from './dungeon.js';
import type { Direction, Dungeon, Position } from './dungeon.js';
import { visibleTiles } from './exploration.js';

export type Run = {
  seed: string; dungeon: Dungeon; player: Position; finished: boolean; turns: number;
  visible: ReadonlySet<string>; explored: ReadonlySet<string>;
};

export function createRun(seed: string): Run {
  const dungeon = generateDungeon(seed);
  const visible = visibleTiles(dungeon.tiles, dungeon.start);
  return { seed, dungeon, player: { ...dungeon.start }, finished: false, turns: 0, visible, explored: visible };
}

export function moveInRun(run: Run, direction: Direction): Run {
  if (run.finished) return run;
  const player = move(run.dungeon.tiles, run.player, direction);
  if (player === run.player) return run;
  const finished = player.x === run.dungeon.exit.x && player.y === run.dungeon.exit.y;
  const visible = visibleTiles(run.dungeon.tiles, player);
  return { ...run, player, finished, turns: run.turns + 1, visible, explored: new Set([...run.explored, ...visible]) };
}

export function waitInRun(run: Run): Run {
  return run.finished ? run : { ...run, turns: run.turns + 1 };
}
