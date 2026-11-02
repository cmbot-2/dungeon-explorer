# Dungeon Explorer

A small dungeon to explore, drawn with Canvas and TypeScript.

Explore four rooms joined by lantern-lit corridors on a 25 × 17 tile map. Click the map or Tab to it, then move with arrow keys or WASD. Stone walls block your path; your position appears beside the map.

Enter a dungeon seed and choose **Explore seed** to recreate a map from its starting position, or choose **New seed** for another layout. The same seed always generates the same chambers, with a reachable set of stairs.

Reach the stairs to finish your run. Movement stops and a completion message appears. **Restart this dungeon** returns to the beginning of the same map, even if you have edited the seed field. You can restart during a run too.

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

The contents of `dist/` can be served by a static host, including a repository subpath such as `/dungeon-explorer/`. Asset URLs are relative; no server-side routes are needed.
