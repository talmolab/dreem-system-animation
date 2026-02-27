export const FPS = 30;
export const W = 1920;
export const H = 1080;

// ─── Color palette ───────────────────────────────────────────────────────────
export const C = {
  bg:      "#05091a",
  surface: "#0c1526",
  card:    "#111d30",
  border:  "#1a3050",
  cyan:    "#22d3ee",   // primary accent
  amber:   "#7dd3fc",   // animals (light blue)
  violet:  "#e879f9",   // microscopy (light magenta)
  green:   "#34d399",   // tracking output
  text:    "#b0bec5",
  muted:   "#556080",
  white:   "#cfd8dc",
};

// ─── Asset paths ─────────────────────────────────────────────────────────────
const A   = "assets/videos/animals/";
const M   = "assets/videos/microscopy/";
const ALS = "als2h_cohort2_cohort2.220508_093004_Camera2_mov.00001";
const T09 = "test_09_5s";

export const HERO = {
  animal: {
    raw:       `${A}${ALS}_5s.mp4`,
    detect:    `${A}${ALS}_5s_keypoints.mp4`,
    bbox:      `${A}${ALS}_5s_bbox.mp4`,
    annotated: `${A}${ALS}_5s_annotated.mp4`,
  },
  micro: {
    raw:       `${M}${T09}.mp4`,
    detect:    `${M}${T09}_mask.mp4`,
    bbox:      `${M}${T09}_bbox.mp4`,
    annotated: `${M}${T09}_annotated.mp4`,
  },
};

export const OUTRO_TILES = [
  // Row 1 – animals
  { src: `${A}${ALS}_5s_annotated.mp4`,                                           label: "Mice BTC",         domain: "animal" as const },
  { src: `${A}eight_flies@180000-200000_sample_0_16704_19204_5s_annotated.mp4`,   label: "Flies13",          domain: "animal" as const },
  { src: `${A}top-10192022175658-0000_h265_CRF12_denoised_5s_annotated.mp4`,      label: "SLAP2M",           domain: "animal" as const },
  { src: `${A}train_labels.group1.centroids_sample_1_6952_8452_5s_annotated.mp4`, label: "Zebrafish10",      domain: "animal" as const },
  // Row 2 – microscopy
  { src: `${M}${T09}_annotated.mp4`,                                              label: "Dynamic Nuclear Net", domain: "micro"  as const },
  { src: `${M}090318-C2C12P7-FGF2-exp1_F0006_5s_annotated.mp4`,                  label: "Phase Contrast",      domain: "micro"  as const },
  { src: `${M}11-2_5s_annotated.mp4`,                                             label: "Lysosomes",           domain: "micro"  as const },
  { src: `${M}A-10-run03_5s_annotated.mp4`,                                       label: "MOT Challenge",       domain: "micro"  as const },
];

// ─── Scene durations (frames) ─────────────────────────────────────────────────
export const DUR = {
  title:    3  * FPS,  //  90
  pipeline: 15 * FPS,  // 450
  algo:     27 * FPS,  // 810
  results:  5  * FPS,  // 150
  outro:    9  * FPS,  // 270
  logo:     8  * FPS,  // 240
};
export const TOTAL_DUR =
  DUR.title + DUR.pipeline + DUR.algo + DUR.results + DUR.outro + DUR.logo;

// ─── Pipeline crossfade frame positions (local to PipelineScene) ───────────
export const XFADE = 15; // 0.5 s crossfade window
export const PS = {
  // raw → detect crossfade window
  detXStart:  5 * FPS - XFADE,   // 135
  detXEnd:    5 * FPS,            // 150
  // detect → bbox crossfade window
  bboxXStart: 10 * FPS - XFADE,  // 285
  bboxXEnd:   10 * FPS,           // 300
  // bbox fade-out window at scene end
  outStart:   DUR.pipeline - XFADE,  // 435
  outEnd:     DUR.pipeline,          // 450
};
