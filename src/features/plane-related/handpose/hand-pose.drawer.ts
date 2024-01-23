import { initPlayerVideo } from "@controls/camera";
import { createDetectorLocal } from "@controls/tensorflow";
import {
  FullSnapEndGesture,
  FullSnapStartGesture,
  HalfSnapEndGesture,
} from "@features/plane-related/handpose/gesture.inits";
import { HandDetector } from "@tensorflow-models/hand-pose-detection";
import type { PixelInput } from "@tensorflow-models/hand-pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import { GestureEstimator, GestureDescription } from "fingerpose";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Hand = "left" | "right";
type StateDispatch = Dispatch<
  SetStateAction<{ clicked: boolean; hand?: Hand }>
>;
let handPoseDrawer: HandPoseDrawer | null = null;

class HandPoseDrawer {
  private isClickStarted = {
    left: false,
    right: false,
  };
  private video: HTMLVideoElement;
  private knownGestures: GestureDescription[] = [
    FullSnapStartGesture,
    FullSnapEndGesture,
    HalfSnapEndGesture,
    HalfSnapEndGesture,
  ];
  private handler: StateDispatch;
  private GE: GestureEstimator = new GestureEstimator(this.knownGestures);

  constructor(video: HTMLVideoElement, handler: StateDispatch) {
    this.video = video;
    this.handler = handler;
  }

  async estimateHands(detector: HandDetector) {
    // get hand landmarks from video
    const hands = await detector.estimateHands(this.video as PixelInput, {
      flipHorizontal: true,
    });

    for (const hand of hands) {
      if (!hand.keypoints3D) {
        return;
      }
      // @ts-expect-error: problem with types on TF side
      const gestureEstimations = this.GE.estimate(hand.keypoints3D, 9);
      const chosenHand = hand.handedness.toLowerCase() as Hand;
      if (gestureEstimations.gestures.length > 0) {
        const gestureResult = gestureEstimations.gestures.reduce((p, c) => {
          return p.score > c.score ? p : c;
        });
        this.makeResult(gestureResult.name, chosenHand);
      }
    }

    setTimeout(() => {
      void this.estimateHands(detector);
    }, 1000 / 30);
  }
  async init() {
    const detector = await createDetectorLocal();
    console.log("mediaPose model loaded");

    await this.estimateHands(detector);
    console.log("Starting predictions");
  }

  makeResult(poseName: string, hand: Hand) {
    if (
      ["full-snap-start", "half-snap-start"].includes(poseName) &&
      !this.isClickStarted[hand]
    ) {
      this.isClickStarted[hand] = true;
      console.log("click started");
    }

    if (
      ["full-snap-end", "half-snap-end"].includes(poseName) &&
      this.isClickStarted[hand]
    ) {
      this.isClickStarted[hand] = false;
      this.handler({
        clicked: true,
        hand,
      });
      setTimeout(() => {
        this.handler({
          clicked: false,
          hand: undefined,
        });
      }, 1000);
      console.log("click ended");
    }
  }
}
export const useFingersClicks = (videoStream: HTMLVideoElement | null) => {
  const [clickedState, setClickedState] = useState<{
    clicked: boolean;
    hand?: Hand;
  }>({
    clicked: false,
  });

  useEffect(() => {
    if (!handPoseDrawer && videoStream) {
      handPoseDrawer = new HandPoseDrawer(videoStream, setClickedState);
      void initPlayerVideo(videoStream).then(() => {
        handPoseDrawer?.init();
      });
    }
  }, [videoStream]);

  return clickedState;
};
