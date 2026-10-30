# Dungeon Explorer

A small dungeon to explore, drawn with Canvas and TypeScript.

Explore connected rooms and lantern-lit passages. Click the map or Tab to it, then move with arrow keys or WASD. Stone walls block your path; your position appears beside the map.

## Run locally

Use Node.js 20.19.x or Node.js 22.12+ and npm. From the repository folder:

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal.

## Development

```sh
npm test        # Run regression checks
npm run check   # Check TypeScript
npm run build   # Check types and build into dist/
npm run preview # Serve the build locally
```

Built with TypeScript and Vite.
