# DREEM System Animation

Animated system overview of [DREEM](https://github.com/talmolab/dreem) (Distinctly Recognizing Each Entity via Matching), built with [Remotion](https://remotion.dev).

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm

## Setup

```sh
npm install
```

## Development

Start the Remotion Studio preview:

```sh
npm run dev
```

This opens a browser-based editor where you can preview and scrub through the animation in real time.

## Rendering

Render the final video:

```sh
npx remotion render
```

Output will be written to the `out/` directory.

## Linting

```sh
npm run lint
```

## Project Structure

```
src/
  Root.tsx            # Remotion entry point, registers compositions
  Composition.tsx     # Main composition wrapper
  DreemOverview.tsx   # Top-level animation component
  constants.ts        # Shared timing/config constants
  components/         # Reusable animation components
  scenes/             # Individual animation scenes
    TitleScene.tsx
    LogoScene.tsx
    PipelineScene.tsx
    AlgorithmScene.tsx
    ResultsScene.tsx
    OutroScene.tsx
```

## License

UNLICENSED
