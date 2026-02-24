import React from "react";
import {
  AbsoluteFill,
  Img,
  Video,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, HERO, PS } from "../constants";

// ─── helpers ─────────────────────────────────────────────────────────────────

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const stageOpacity = (
  frame: number,
  fadeInStart: number,
  holdStart: number,
  holdEnd: number,
  fadeOutEnd: number
) =>
  interpolate(
    frame,
    [fadeInStart, holdStart, holdEnd, fadeOutEnd],
    [0, 1, 1, 0],
    clamp
  );

// ─── Stage metadata ───────────────────────────────────────────────────────────

const STAGES = [
  {
    label: "Collect Biological Timelapses",
    step:  "01",
    color: C.cyan,
    // opacity envelope: fade in 0→15, hold 15→135, fade out 135→150
    opFn: (f: number) => stageOpacity(f, 0, 15, PS.detXStart, PS.detXEnd),
  },
  {
    label: "Detect Entities of Interest",
    step:  "02",
    color: C.violet,
    opFn: (f: number) => stageOpacity(f, PS.detXStart, PS.detXEnd, PS.bboxXStart, PS.bboxXEnd),
  },
  {
    label: "Prepare Detections for Tracking",
    step:  "03",
    color: C.amber,
    opFn: (f: number) => stageOpacity(f, PS.bboxXStart, PS.bboxXEnd, PS.outStart, PS.outEnd),
  },
];

// ─── Video opacity helpers (one per stage version) ───────────────────────────

const rawOp   = (f: number) => stageOpacity(f, 0,            15,           PS.detXStart,  PS.detXEnd);
const detOp   = (f: number) => stageOpacity(f, PS.detXStart, PS.detXEnd,   PS.bboxXStart, PS.bboxXEnd);
const bboxOp  = (f: number) => stageOpacity(f, PS.bboxXStart, PS.bboxXEnd, PS.outStart,   PS.outEnd);

// ─── Single stacked video panel ───────────────────────────────────────────────

const VideoStack: React.FC<{
  raw: string;
  detect: string;
  bbox: string;
  frame: number;
  style?: React.CSSProperties;
}> = ({ raw, detect, bbox, frame, style }) => (
  <div
    style={{
      position: "relative",
      borderRadius: 14,
      overflow: "hidden",
      background: "#000",
      ...style,
    }}
  >
    {[
      { src: raw,    op: rawOp(frame) },
      { src: detect, op: detOp(frame) },
      { src: bbox,   op: bboxOp(frame) },
    ].map(({ src, op }) =>
      op > 0 ? (
        <Video
          key={src}
          src={staticFile(src)}
          muted
          loop
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: op,
          }}
        />
      ) : null
    )}
  </div>
);

// ─── PipelineScene ───────────────────────────────────────────────────────────

export const PipelineScene: React.FC = () => {
  const frame = useCurrentFrame();

  const detectLogoOp = detOp(frame);

  const PANEL_W = 780;
  const PANEL_H = 660;
  const TOP_PAD = 180;
  const SIDE_PAD = 72;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 0%, #0d1f3c 0%, ${C.bg} 60%)`,
        fontFamily: "sans-serif",
      }}
    >
      {/* ── Stage label (3 layers, fade in/out) ── */}
      <div
        style={{
          position: "absolute",
          top: 42,
          left: SIDE_PAD,
          right: 0,
          height: 84,
        }}
      >
        {STAGES.map(({ label, step, color, opFn }) => (
          <div
            key={step}
            style={{
              position: "absolute",
              opacity: opFn(frame),
            }}
          >
            <span
              style={{ fontSize: 48, fontWeight: 700, color: C.text, letterSpacing: "-0.5px" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Left panel: Animal Behavior ── */}
      <div
        style={{
          position: "absolute",
          left: SIDE_PAD,
          top: TOP_PAD,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 27,
              fontWeight: 600,
              color: C.amber,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Animals
          </div>
          <div
            style={{
              opacity: detectLogoOp,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontFamily: "sans-serif",
              color: `${C.amber}cc`,
            }}
          >
            <span style={{ color: C.muted }}>Detector:</span>
            <Img
              src={staticFile("assets/sleap-logo.png")}
              style={{ height: 48, objectFit: "contain" }}
            />
            <span style={{ letterSpacing: "0.03em" }}>sleap.ai</span>
          </div>
        </div>
        <VideoStack
          raw={HERO.animal.raw}
          detect={HERO.animal.detect}
          bbox={HERO.animal.bbox}
          frame={frame}
          style={{ width: PANEL_W, height: PANEL_H, border: `2px solid ${C.amber}33` }}
        />
        <div
          style={{
            fontSize: 14,
            fontFamily: "sans-serif",
            fontWeight: 500,
            color: C.muted,
            marginTop: 10,
          }}
        >
          Dataset: <span style={{ color: C.amber }}>Mice BTC</span>
        </div>
      </div>

      {/* ── Right panel: Live Cell Imaging ── */}
      <div
        style={{
          position: "absolute",
          left: SIDE_PAD + PANEL_W + 144,
          top: TOP_PAD,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 27,
              fontWeight: 600,
              color: C.violet,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Microscopy
          </div>
          <div
            style={{
              opacity: detectLogoOp,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontFamily: "sans-serif",
              color: `${C.violet}cc`,
            }}
          >
            <span style={{ color: C.muted }}>Detector:</span>
            <Img
              src={staticFile("assets/cellpose-logo.png")}
              style={{ height: 48, objectFit: "contain" }}
            />
            <span style={{ letterSpacing: "0.03em" }}>cellpose.org</span>
          </div>
        </div>
        <VideoStack
          raw={HERO.micro.raw}
          detect={HERO.micro.detect}
          bbox={HERO.micro.bbox}
          frame={frame}
          style={{ width: PANEL_W, height: PANEL_H, border: `2px solid ${C.violet}33` }}
        />
        <div
          style={{
            fontSize: 14,
            fontFamily: "sans-serif",
            fontWeight: 500,
            color: C.muted,
            marginTop: 10,
          }}
        >
          Dataset: <span style={{ color: C.violet }}>Dynamic Nuclear Net</span>
        </div>
      </div>


      {/* ── VS divider ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: TOP_PAD + 28 + PANEL_H / 2 - 20,
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div style={{ width: 1, height: 60, background: `${C.border}` }} />
        <div
          style={{
            fontSize: 11,
            color: C.muted,
            letterSpacing: "0.15em",
            fontWeight: 600,
          }}
        >
          &amp;
        </div>
        <div style={{ width: 1, height: 60, background: `${C.border}` }} />
      </div>
    </AbsoluteFill>
  );
};
