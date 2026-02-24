import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "../constants";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const opacity = interpolate(frame, [0, fps * 0.4], [0, 1], clamp);
  const urlOpacity = interpolate(frame, [fps * 0.8, fps * 1.3], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 45%, #0d1f3c 0%, ${C.bg} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div style={{ transform: `scale(${scale})`, opacity }}>
        <Img
          src={staticFile("assets/dreem.png")}
          style={{ height: 300, objectFit: "contain" }}
        />
      </div>
      <div
        style={{
          opacity: urlOpacity,
          fontSize: 63,
          fontFamily: "sans-serif",
          fontWeight: 400,
          color: C.cyan,
          letterSpacing: "0.06em",
        }}
      >
        dreem.sleap.ai
      </div>
    </AbsoluteFill>
  );
};
