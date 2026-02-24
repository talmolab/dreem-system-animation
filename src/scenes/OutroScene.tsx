import React from "react";
import {
  AbsoluteFill,
  Loop,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, DUR, FPS, H, OUTRO_TILES, W } from "../constants";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// 4 columns × 2 rows
const COLS = 4;
const ROWS = 2;
const CELL_W = W / COLS;
const CELL_H = H / ROWS;

const DOMAIN_COLOR = { animal: C.amber, micro: C.violet };

// Video durations in frames (at 30fps) — used for Loop
const TILE_FRAMES: Record<string, number> = {
  [`${OUTRO_TILES[0].src}`]: Math.floor(9.4 * FPS),
  [`${OUTRO_TILES[1].src}`]: Math.floor(5.0 * FPS),
  [`${OUTRO_TILES[2].src}`]: Math.floor(12.0 * FPS),
  [`${OUTRO_TILES[3].src}`]: Math.floor(6.4 * FPS),
  [`${OUTRO_TILES[4].src}`]: Math.floor(3.0 * FPS),
  [`${OUTRO_TILES[5].src}`]: Math.floor(4.0 * FPS),
  [`${OUTRO_TILES[6].src}`]: Math.floor(8.1 * FPS),
  [`${OUTRO_TILES[7].src}`]: Math.floor(6.0 * FPS),
};

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* ── Video grid (8 tiles) ── */}
      {OUTRO_TILES.map(({ src, label, domain }, idx) => {
        const col = idx % COLS;
        const row = Math.floor(idx / COLS);

        // Staggered spring entrance
        const delay = col * 6 + row * 20;
        const p = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 100 } });
        const scale = interpolate(p, [0, 1], [0.88, 1]);
        const opacity = interpolate(p, [0, 0.4], [0, 1], clamp);

        const accent = DOMAIN_COLOR[domain];
        const loopDuration = TILE_FRAMES[src] || DUR.outro;

        return (
          <div
            key={src}
            style={{
              position: "absolute",
              left: col * CELL_W,
              top:  row * CELL_H,
              width:  CELL_W,
              height: CELL_H,
              padding: 4,
              boxSizing: "border-box",
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                overflow: "hidden",
                border: `1.5px solid ${accent}44`,
                position: "relative",
              }}
            >
              <Loop durationInFrames={loopDuration}>
                <OffthreadVideo
                  src={staticFile(src)}
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Loop>
              {/* Label overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "18px 10px 8px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
                  fontSize: 12,
                  fontWeight: 600,
                  color: accent,
                  fontFamily: "sans-serif",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
              {/* Domain row indicator */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: accent,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        );
      })}

    </AbsoluteFill>
  );
};
