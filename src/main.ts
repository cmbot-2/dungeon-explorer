import './style.css';
import { generateDungeon, move } from './dungeon';
import type { Direction } from './dungeon';

const canvas = document.querySelector<HTMLCanvasElement>('#dungeon')!;
const context = canvas.getContext('2d');
if (!context) throw new Error('Canvas 2D is required to render the dungeon.');
const ctx = context;
const tileSize = 32;
ctx.imageSmoothingEnabled = false;
const seedInput = document.querySelector<HTMLInputElement>('#seed')!;
let dungeon = generateDungeon(seedInput.value);
let player = { ...dungeon.start };
const position = document.querySelector<HTMLElement>('#position')!;
const status = document.querySelector<HTMLElement>('#movement-status')!;

function block(x: number, y: number, width: number, height: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function draw() {
  dungeon.tiles.forEach((row, y) => {
    [...row].forEach((tile, x) => {
      const left = x * tileSize;
      const top = y * tileSize;
      if (tile === '#') {
        block(left, top, 32, 32, '#1b2b29');
        block(left + 1, top + 1, 30, 25, '#354842');
        block(left + 2, top + 2, 28, 3, '#475a51');
        block(left + 15, top + 4, 2, 11, '#263a34');
        block(left + 2, top + 16, 28, 2, '#263a34');
      } else {
        block(left, top, 32, 32, (x + y) % 2 ? '#647366' : '#6b796b');
        block(left + 2, top + 30, 28, 1, '#526356');
        if ((x * 3 + y) % 5 === 0) block(left + 7, top + 10, 7, 2, '#798676');
        if (tile === 'L') {
          block(left + 8, top + 6, 16, 20, '#717454');
          block(left + 13, top + 16, 6, 12, '#443d2e');
          block(left + 11, top + 9, 10, 11, '#e2a956');
          block(left + 14, top + 6, 5, 11, '#fff1ab');
        }
        if (tile === 'E') {
          block(left + 5, top + 5, 22, 24, '#253a35');
          for (let step = 0; step < 4; step++) {
            block(left + 7 + step * 2, top + 8 + step * 5, 18 - step * 4, 3, '#a7cec0');
          }
        }
        if (x === player.x && y === player.y) {
          block(left + 7, top + 26, 19, 4, '#40564c');
          block(left + 10, top + 4, 13, 9, '#edd098');
          block(left + 8, top + 11, 17, 15, '#d5a044');
          block(left + 12, top + 10, 10, 7, '#3e4036');
          block(left + 14, top + 12, 2, 2, '#fff4d0');
          block(left + 19, top + 12, 2, 2, '#fff4d0');
          block(left + 11, top + 25, 4, 5, '#303a32');
          block(left + 20, top + 25, 4, 5, '#303a32');
        }
      }
    });
  });
  position.textContent = `Column ${player.x + 1}, row ${player.y + 1}`;
  canvas.setAttribute('aria-label', `Stone dungeon with four connected chambers. Explorer at column ${player.x + 1}, row ${player.y + 1}. Stairs at column ${dungeon.exit.x + 1}, row ${dungeon.exit.y + 1}.`);
}

const keys: Record<string, Direction | undefined> = {
  ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down',
  ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right',
};
canvas.addEventListener('pointerdown', () => canvas.focus());
canvas.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
  const direction = keys[event.key.length === 1 ? event.key.toLowerCase() : event.key];
  if (!direction) return;
  event.preventDefault();
  const next = move(dungeon.tiles, player, direction);
  if (next === player) {
    status.textContent = 'A stone wall blocks the way.';
    return;
  }
  player = next;
  draw();
  status.textContent = player.x === dungeon.exit.x && player.y === dungeon.exit.y
    ? 'You found the stairs. Keep exploring the chambers.' : position.textContent;
});

function exploreSeed() {
  seedInput.value = seedInput.value.trim() || 'forest-light';
  dungeon = generateDungeon(seedInput.value);
  player = { ...dungeon.start };
  draw();
  status.textContent = `Exploring seed ${seedInput.value}. Four chambers, one connected path.`;
  canvas.focus({ preventScroll: true });
}
document.querySelector<HTMLFormElement>('#seed-form')!.addEventListener('submit', (event) => {
  event.preventDefault();
  exploreSeed();
});
document.querySelector('#new-seed')!.addEventListener('click', () => {
  seedInput.value = crypto.getRandomValues(new Uint32Array(1))[0]!.toString(36);
  exploreSeed();
});
draw();
