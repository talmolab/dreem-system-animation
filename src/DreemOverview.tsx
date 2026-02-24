import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { FadeWrapper } from "./components/FadeWrapper";
import { TitleScene }    from "./scenes/TitleScene";
import { PipelineScene } from "./scenes/PipelineScene";
import { AlgorithmScene } from "./scenes/AlgorithmScene";
import { ResultsScene }  from "./scenes/ResultsScene";
import { OutroScene }    from "./scenes/OutroScene";
import { LogoScene }     from "./scenes/LogoScene";
import { DUR } from "./constants";

export const DreemOverview: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        {/* 1 ── Title card */}
        <Series.Sequence durationInFrames={DUR.title} premountFor={30}>
          <FadeWrapper durationInFrames={DUR.title} fadeIn={12} fadeOut={12}>
            <TitleScene />
          </FadeWrapper>
        </Series.Sequence>

        {/* 2 ── Pipeline: raw → detect → bbox */}
        <Series.Sequence durationInFrames={DUR.pipeline} premountFor={30}>
          <FadeWrapper durationInFrames={DUR.pipeline} fadeIn={12} fadeOut={12}>
            <PipelineScene />
          </FadeWrapper>
        </Series.Sequence>

        {/* 3 ── DREEM algorithm internals */}
        <Series.Sequence durationInFrames={DUR.algo} premountFor={30}>
          <FadeWrapper durationInFrames={DUR.algo} fadeIn={12} fadeOut={12}>
            <AlgorithmScene />
          </FadeWrapper>
        </Series.Sequence>

        {/* 4 ── Annotated tracking results */}
        <Series.Sequence durationInFrames={DUR.results} premountFor={30}>
          <FadeWrapper durationInFrames={DUR.results} fadeIn={12} fadeOut={12}>
            <ResultsScene />
          </FadeWrapper>
        </Series.Sequence>

        {/* 5 ── Outro: full dataset grid */}
        <Series.Sequence durationInFrames={DUR.outro} premountFor={30}>
          <FadeWrapper durationInFrames={DUR.outro} fadeIn={12} fadeOut={12}>
            <OutroScene />
          </FadeWrapper>
        </Series.Sequence>

        {/* 6 ── DREEM logo + docs URL */}
        <Series.Sequence durationInFrames={DUR.logo} premountFor={30}>
          <FadeWrapper durationInFrames={DUR.logo} fadeIn={12} fadeOut={20}>
            <LogoScene />
          </FadeWrapper>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
