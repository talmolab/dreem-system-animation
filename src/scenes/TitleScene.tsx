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

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const logoY = interpolate(logoScale, [0, 1], [40, 0]);

  const taglineOpacity = interpolate(frame, [fps * 0.6, fps * 1.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineScale = spring({ frame: frame - fps * 0.5, fps, config: { damping: 200 } });
  const lineW = interpolate(lineScale, [0, 1], [0, 510]);

  // Subtitle fade in
  const subtitleOpacity = interpolate(frame, [fps * 1.0, fps * 1.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, #0d1f3c 0%, ${C.bg} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale}) translateY(${logoY}px)`,
          marginBottom: 16,
        }}
      >
        <Img
          src={staticFile("assets/dreem.png")}
          style={{ height: 180, objectFit: "contain" }}
        />
      </div>

      {/* DREEM text */}
      <div
        style={{
          opacity: taglineOpacity,
          fontSize: 57,
          fontWeight: 700,
          color: C.white,
          fontFamily: "sans-serif",
          letterSpacing: "0.14em",
          marginBottom: 10,
        }}
      >
        DREEM
      </div>

      {/* Accent line */}
      <div
        style={{
          width: lineW,
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`,
          marginBottom: 28,
        }}
      />

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          fontSize: 39,
          color: C.text,
          fontFamily: "sans-serif",
          fontWeight: 300,
          letterSpacing: "0.08em",
          textAlign: "center",
        }}
      >
        Learnable multiple object tracking across biological scales
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          fontSize: 27,
          color: C.muted,
          fontFamily: "sans-serif",
          fontWeight: 400,
          marginTop: 14,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        System Overview
      </div>
    </AbsoluteFill>
  );
};
