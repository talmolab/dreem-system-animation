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

const BBOX_BLUE = "#4a90d9";
const BBOX_RED = "#e05252";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const BOX_W = 332;
const ASSOC_W = 383;
const ASSIGN_W = 332;

// ─── Spotlight timing ────────────────────────────────────────────────────────

const STEPS = [
  { id: "queries",     spotStart: 30,  spotEnd: 120, transEnd: 150, caption: "Input detections at the current frame" },
  { id: "keys",        spotStart: 120, spotEnd: 210, transEnd: 240, caption: "Tracked identities from previous frames" },
  { id: "features",    spotStart: 240, spotEnd: 330, transEnd: 360, caption: "Visual, spatial, and temporal embeddings encode each detection" },
  { id: "transformer", spotStart: 360, spotEnd: 450, transEnd: 480, caption: "Self and cross attention layers match queries to keys" },
  { id: "association", spotStart: 480, spotEnd: 570, transEnd: 600, caption: "Cosine similarity matrix scores identity matches" },
  { id: "assignment",  spotStart: 600, spotEnd: 690, transEnd: 720, caption: "Hungarian algorithm assigns final track identities" },
] as const;

// Final pipeline layout positions (absolute, centered in 1920x1080)
// Pipeline row sits at y=120, centered horizontally
// Layout: [QK stack] → Features → Transformer → Association → Assignment
// Total width with gaps: BOX_W + 24 + BOX_W + 24 + BOX_W + 24 + ASSOC_W + 24 + ASSIGN_W = 1807
const PIPELINE_LEFT = (1920 - 1807) / 2; // ~56px
const ARROW_W = 24;
const ROW_Y = 120;

// X positions for each panel in the final pipeline layout
const FINAL_X = {
  queries:     PIPELINE_LEFT,
  keys:        PIPELINE_LEFT,
  features:    PIPELINE_LEFT + BOX_W + ARROW_W,
  transformer: PIPELINE_LEFT + BOX_W + ARROW_W + BOX_W + ARROW_W,
  association: PIPELINE_LEFT + BOX_W + ARROW_W + BOX_W + ARROW_W + BOX_W + ARROW_W,
  assignment:  PIPELINE_LEFT + BOX_W + ARROW_W + BOX_W + ARROW_W + BOX_W + ARROW_W + ASSOC_W + ARROW_W,
};

// Queries sits in top half, Keys in bottom half of the QK stack area
const QK_STACK_TOP = ROW_Y;
const FINAL_Y = {
  queries:     QK_STACK_TOP,
  keys:        QK_STACK_TOP + 390, // below queries box
  features:    ROW_Y + 80,
  transformer: ROW_Y + 80,
  association: ROW_Y + 80,
  assignment:  ROW_Y + 80,
};

const SPOT_SCALE = 1.8;

// Arrow positions (between panels, vertically centered)
const ARROWS = [
  { x: FINAL_X.features - ARROW_W,    y: ROW_Y + 280, settledFrame: 150, direction: "right" as const },
  { x: FINAL_X.transformer - ARROW_W, y: ROW_Y + 280, settledFrame: 360, direction: "right" as const },
  { x: FINAL_X.association - ARROW_W, y: ROW_Y + 280, settledFrame: 480, direction: "right" as const },
  { x: FINAL_X.assignment - ARROW_W,  y: ROW_Y + 280, settledFrame: 600, direction: "right" as const },
];

// ─── Arrow component ─────────────────────────────────────────────────────────

const Arrow: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const w = interpolate(p, [0, 1], [0, 24], clamp);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ width: w, height: 2, background: `${C.cyan}66`, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            right: -1,
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
            borderLeft: `6px solid ${C.cyan}66`,
            opacity: interpolate(p, [0, 1], [0, 1], clamp),
          }}
        />
      </div>
    </div>
  );
};

// ─── Detection crop thumbnail ────────────────────────────────────────────────

const CropImg: React.FC<{
  src: string;
  borderColor: string;
  size?: number;
  label?: string;
}> = ({ src, borderColor, size = 120, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        border: "none",
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
    {label && (
      <span style={{ fontSize: 10, color: C.muted, fontFamily: "sans-serif" }}>{label}</span>
    )}
  </div>
);

// ─── Panel content components (simplified — no internal animation) ───────────

const PanelShell: React.FC<{
  accent: string;
  title: string;
  children: React.ReactNode;
  width?: number;
}> = ({ accent, title, children, width = BOX_W }) => (
  <div
    style={{
      width,
      background: C.card,
      borderRadius: 14,
      border: `1.5px solid ${accent}33`,
      padding: "14px 14px 12px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}
  >
    <div style={{ height: 3, borderRadius: 2, background: accent, marginBottom: 2 }} />
    <div
      style={{
        fontSize: 14,
        fontWeight: 700,
        color: accent,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {title}
    </div>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

const QueriesContent: React.FC = () => (
  <PanelShell accent={C.cyan} title="Queries (t)" width={BOX_W}>
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      <CropImg src="assets/sys-overview-vid-frame-1-crop-0.png" borderColor={BBOX_BLUE} size={120} />
      <CropImg src="assets/sys-overview-vid-frame-1-crop-1.png" borderColor={BBOX_RED} size={120} />
    </div>
    <div style={{ marginTop: 6 }}>
      <div style={{ borderRadius: 8, overflow: "hidden", border: `1.5px solid ${C.cyan}44` }}>
        <Img
          src={staticFile("assets/sys-overview-vid-frame-1.png")}
          style={{ width: "100%", height: 150, objectFit: "cover" }}
        />
      </div>
    </div>
    <div style={{ fontSize: 10, color: C.muted, marginTop: 2, textAlign: "center" }}>
      New detections at current frame
    </div>
  </PanelShell>
);

const KeysContent: React.FC = () => (
  <PanelShell accent={C.violet} title="Keys (t-1, t-2)" width={BOX_W}>
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      <CropImg src="assets/sys-overview-vid-frame-2-crop-0.png" borderColor={C.violet} size={102} label="t-1" />
      <CropImg src="assets/sys-overview-vid-frame-2-crop-1.png" borderColor={C.violet} size={102} label="t-1" />
    </div>
    <div style={{ borderRadius: 8, overflow: "hidden", border: `1.5px solid ${C.violet}44` }}>
      <Img
        src={staticFile("assets/sys-overview-vid-frame-2-bbox.png")}
        style={{ width: "100%", height: 90, objectFit: "cover" }}
      />
    </div>
    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
      <CropImg src="assets/sys-overview-vid-frame-3-crop-0.png" borderColor={`${C.violet}88`} size={72} label="t-2" />
      <CropImg src="assets/sys-overview-vid-frame-3-crop-1.png" borderColor={`${C.violet}88`} size={72} label="t-2" />
    </div>
    <div style={{ fontSize: 10, color: C.muted, marginTop: 2, textAlign: "center" }}>
      Previously tracked identities
    </div>
  </PanelShell>
);

const FeaturesContent: React.FC = () => (
  <PanelShell accent="#38bdf8" title="Features" width={BOX_W}>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>Visual</div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 102, height: 102, borderRadius: 5, overflow: "hidden", border: `1.5px solid ${BBOX_BLUE}55` }}>
            <Img src={staticFile("assets/sys-overview-vid-frame-1-crop-0.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ width: 102, height: 102, borderRadius: 5, overflow: "hidden", border: `1.5px solid ${BBOX_RED}55` }}>
            <Img src={staticFile("assets/sys-overview-vid-frame-1-crop-1.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>Spatial</div>
        <div style={{ borderRadius: 5, overflow: "hidden", border: `1.5px solid ${C.amber}44`, height: 90 }}>
          <Img src={staticFile("assets/actual_learned_pos_emb_vis.png")} style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated" }} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>Temporal</div>
        <div style={{ borderRadius: 5, overflow: "hidden", border: `1.5px solid ${C.violet}44`, height: 42 }}>
          <Img src={staticFile("assets/actual_learned_temp_emb_vis.png")} style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated" }} />
        </div>
      </div>
    </div>
  </PanelShell>
);

const TransformerContent: React.FC = () => (
  <PanelShell accent="#f472b6" title="Transformer" width={BOX_W}>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 255 }}>
      <div
        style={{
          width: 210,
          height: 210,
          borderRadius: 30,
          border: "2.5px solid #f472b6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a0f2a",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#f472b6",
            letterSpacing: "0.04em",
            textAlign: "center",
            lineHeight: 1.6,
            whiteSpace: "pre",
          }}
        >
          {"SELF +\nCROSS\nATTENTION"}
        </div>
      </div>
    </div>
  </PanelShell>
);

const AssociationContent: React.FC = () => (
  <PanelShell accent={C.green} title="Association" width={ASSOC_W}>
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", gap: 4, marginLeft: 48, marginBottom: 2 }}>
        {[
          { src: "assets/association_matrix/1x/column-1.png", color: BBOX_BLUE },
          { src: "assets/association_matrix/1x/column-2.png", color: BBOX_RED },
          { src: "assets/association_matrix/1x/column-3.png", color: BBOX_BLUE },
          { src: "assets/association_matrix/1x/column-4.png", color: BBOX_RED },
        ].map(({ src, color }) => (
          <div key={src} style={{ width: 60, height: 60, borderRadius: 5, border: `2px solid ${color}`, overflow: "hidden" }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 5, alignItems: "stretch" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 5, border: `2px solid ${C.muted}`, overflow: "hidden" }}>
            <Img src={staticFile("assets/association_matrix/1x/top-row.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ width: 60, height: 60, borderRadius: 5, border: `2px solid ${C.muted}`, overflow: "hidden" }}>
            <Img src={staticFile("assets/association_matrix/1x/bottom-row.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        <div style={{ flex: 1, borderRadius: 4, overflow: "hidden" }}>
          <Img src={staticFile("assets/association_matrix/1x/heatmap.png")} style={{ width: "100%", height: "100%", objectFit: "fill" }} />
        </div>
        <div style={{ width: 14, borderRadius: 2, overflow: "hidden" }}>
          <Img src={staticFile("assets/association_matrix/1x/colorbar.png")} style={{ width: "100%", height: "100%", objectFit: "fill" }} />
        </div>
      </div>
    </div>
    <div style={{ fontSize: 10, color: C.muted, textAlign: "center", marginTop: 4 }}>
      Cosine similarity matrix
    </div>
  </PanelShell>
);

const AssignmentContent: React.FC = () => (
  <PanelShell accent={C.amber} title="Assignment" width={ASSIGN_W}>
    <div style={{ borderRadius: 8, overflow: "hidden", border: `1.5px solid ${C.amber}44` }}>
      <Img
        src={staticFile("assets/sys-overview-vid-frame-1-bbox.png")}
        style={{ width: "100%", height: 225, objectFit: "cover" }}
      />
    </div>
    <div style={{ fontSize: 10, color: C.muted, marginTop: 4, textAlign: "center" }}>
      Assigned identities
    </div>
  </PanelShell>
);

const PANEL_COMPONENTS: Record<string, React.FC> = {
  queries: QueriesContent,
  keys: KeysContent,
  features: FeaturesContent,
  transformer: TransformerContent,
  association: AssociationContent,
  assignment: AssignmentContent,
};

const PANEL_WIDTHS: Record<string, number> = {
  queries: BOX_W,
  keys: BOX_W,
  features: BOX_W,
  transformer: BOX_W,
  association: ASSOC_W,
  assignment: ASSIGN_W,
};

// ─── AnimatedPanel ───────────────────────────────────────────────────────────

const AnimatedPanel: React.FC<{
  id: string;
  spotStart: number;
  spotEnd: number;
  transEnd: number;
}> = ({ id, spotStart, spotEnd, transEnd }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const finalX = FINAL_X[id as keyof typeof FINAL_X];
  const finalY = FINAL_Y[id as keyof typeof FINAL_Y];
  const w = PANEL_WIDTHS[id];

  // Spotlight position: center the panel on the right half
  const spotX = 1920 * 0.55 - (w * SPOT_SCALE) / 2;
  const spotY = 540 - 200;

  // Before spotlight: invisible
  if (frame < spotStart) return null;

  // Fade in at spotlight start
  const fadeIn = interpolate(frame, [spotStart, spotStart + 12], [0, 1], clamp);

  // Transition from spotlight to final position
  const transProgress = frame < spotEnd
    ? 0
    : spring({ frame: frame - spotEnd, fps, config: { damping: 18, stiffness: 80 } });

  const x = interpolate(transProgress, [0, 1], [spotX, finalX]);
  const y = interpolate(transProgress, [0, 1], [spotY, finalY]);
  const scale = interpolate(transProgress, [0, 1], [SPOT_SCALE, 1]);

  const Content = PANEL_COMPONENTS[id];

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        opacity: fadeIn,
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: "top left",
        zIndex: frame < transEnd ? 10 : 1,
      }}
    >
      <Content />
    </div>
  );
};

// ─── StepCaption ─────────────────────────────────────────────────────────────

const StepCaption: React.FC = () => {
  const frame = useCurrentFrame();

  // Find the active step
  const active = STEPS.find(s => frame >= s.spotStart && frame < s.transEnd);
  if (!active) return null;

  const fadeIn = interpolate(frame, [active.spotStart, active.spotStart + 10], [0, 1], clamp);
  const fadeOut = interpolate(frame, [active.spotEnd - 5, active.spotEnd + 10], [1, 0], clamp);
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <div
      style={{
        position: "absolute",
        top: 82,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 28,
        color: C.white,
        fontFamily: "sans-serif",
        opacity,
        letterSpacing: "0.02em",
      }}
    >
      {active.caption}
    </div>
  );
};

// ─── AlgorithmScene ──────────────────────────────────────────────────────────

export const AlgorithmScene: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 18], [0, 1], clamp);
  const titleY = interpolate(frame, [0, 18], [16, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 0%, #0d1f3c 0%, ${C.bg} 60%)`,
        fontFamily: "sans-serif",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 0,
          right: 0,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 45,
          fontWeight: 700,
          color: C.text,
          letterSpacing: "-0.5px",
          textAlign: "center",
        }}
      >
        How DREEM Works
      </div>

      {/* Caption */}
      <StepCaption />

      {/* Animated panels */}
      {STEPS.map((step) => (
        <AnimatedPanel
          key={step.id}
          id={step.id}
          spotStart={step.spotStart}
          spotEnd={step.spotEnd}
          transEnd={step.transEnd}
        />
      ))}

      {/* Arrows — appear when the preceding panel settles */}
      {ARROWS.map((arrow, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: arrow.x,
            top: arrow.y,
          }}
        >
          <Arrow delay={arrow.settledFrame} />
        </div>
      ))}

      {/* DREEM watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 54,
          opacity: interpolate(frame, [60, 80], [0, 0.3], clamp),
        }}
      >
        <Img
          src={staticFile("assets/dreem.png")}
          style={{ height: 42, objectFit: "contain" }}
        />
      </div>
    </AbsoluteFill>
  );
};
