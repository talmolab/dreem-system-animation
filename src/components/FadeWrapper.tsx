import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const FadeWrapper: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  fadeIn?: number;
  fadeOut?: number;
}> = ({ children, durationInFrames, fadeIn = 12, fadeOut = 12 }) => {
  const frame = useCurrentFrame();
  const opIn = interpolate(frame, [0, fadeIn], [0, 1], {
    extrapolateRight: "clamp",
  });
  const opOut = interpolate(
    frame,
    [durationInFrames - fadeOut, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill style={{ opacity: Math.min(opIn, opOut) }}>
      {children}
    </AbsoluteFill>
  );
};
