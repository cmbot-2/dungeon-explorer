# Dungeon Explorer

A small dungeon scene drawn with Canvas and TypeScript.

The map has connected rooms, lanterns, an explorer, and a legend. The current build is a static scene; the explorer does not move.

## Run locally

Use Node.js 20.19.x or Node.js 22.12+ and npm. From the repository folder:

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal.

## Development

```sh
npm run check   # Check TypeScript
npm run build   # Check types and build into dist/
npm run preview # Serve the build locally
```

Built with TypeScript and Vite.
