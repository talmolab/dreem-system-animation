import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { DreemOverview } from "./DreemOverview";
import { MyComposition } from "./Composition";
import { TOTAL_DUR, FPS, W, H } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* DREEM system overview */}
      <Composition
        id="DreemOverview"
        component={DreemOverview}
        durationInFrames={TOTAL_DUR}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* Test composition (kept for reference) */}
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
