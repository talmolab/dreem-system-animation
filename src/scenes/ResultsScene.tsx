import React from "react";
import {
  AbsoluteFill,
  Img,
  Loop,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FPS, HERO } from "../constants";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const ResultsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Panels spring in from below
  const leftP = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const rightP = spring({ frame: frame - 22, fps, config: { damping: 14, stiffness: 100 } });

  const panelYL = interpolate(leftP,  [0, 1], [60, 0]);
  const panelYR = interpolate(rightP, [0, 1], [60, 0]);

  const titleOp = interpolate(frame, [0, 18], [0, 1], clamp);
  const titleY  = interpolate(frame, [0, 18], [16, 0], clamp);

  const badgeOp = interpolate(frame, [30, 50], [0, 1], clamp);

  const PANEL_W = 840;
  const PANEL_H = 735;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 0%, #0a1f10 0%, ${C.bg} 60%)`,
        fontFamily: "sans-serif",
      }}
    >
      {/* ── Heading ── */}
      <div
        style={{
          position: "absolute",
          top: 42,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 12,
          paddingLeft: 72,
        }}
      >
        <div
          style={{
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 700, color: C.text, letterSpacing: "-0.5px" }}>
            DREEM Tracks Identities Over Time
          </span>
        </div>
      </div>

      {/* ── Left panel: animal annotated ── */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 150,
          transform: `translateY(${panelYL}px)`,
          opacity: leftP,
        }}
      >
        <div
          style={{
            borderRadius: 14,
            overflow: "hidden",
            border: `2px solid ${C.amber}55`,
            width: PANEL_W,
            height: PANEL_H,
          }}
        >
          <Loop durationInFrames={Math.floor(9.4 * FPS)}>
            <OffthreadVideo
              src={staticFile(HERO.animal.annotated)}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Loop>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 10,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: C.amber,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Mice BTC
          </div>
          <div style={{ opacity: badgeOp }}>
            <Img
              src={staticFile("assets/sleap-logo.png")}
              style={{ height: 22, objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

      {/* ── Right panel: microscopy annotated ── */}
      <div
        style={{
          position: "absolute",
          right: 72,
          top: 150,
          transform: `translateY(${panelYR}px)`,
          opacity: rightP,
        }}
      >
        <div
          style={{
            borderRadius: 14,
            overflow: "hidden",
            border: `2px solid ${C.violet}55`,
            width: PANEL_W,
            height: PANEL_H,
          }}
        >
          <Loop durationInFrames={Math.floor(5.0 * FPS)}>
            <OffthreadVideo
              src={staticFile(HERO.micro.annotated)}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Loop>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 10,
            marginTop: 10,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: C.violet,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Dynamic Nuclear Net
          </div>
          <div style={{ opacity: badgeOp }}>
            <Img
              src={staticFile("assets/cellpose-logo.png")}
              style={{ height: 22, objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

      {/* ── "Trajectories" badge ── */}
      <div
        style={{
          position: "absolute",
          bottom: 26,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: badgeOp,
          background: `${C.green}18`,
          border: `1px solid ${C.green}44`,
          borderRadius: 20,
          padding: "7px 20px",
          fontSize: 20,
          color: C.green,
          fontWeight: 600,
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
        }}
      >
        Output: per-entity trajectories across time
      </div>
    </AbsoluteFill>
  );
};
