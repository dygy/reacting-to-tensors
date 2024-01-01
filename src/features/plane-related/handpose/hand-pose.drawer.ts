import { initPlayerVideo } from "@controls/camera";
import { createDetectorLocal } from "@controls/tensorflow";
import { HandDetector } from "@tensorflow-models/hand-pose-detection";
import type { PixelInput } from "@tensorflow-models/hand-pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import { Gestures, GestureEstimator, GestureDescription } from "fingerpose";

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
    Gestures.VictoryGesture,
    Gestures.ThumbsUpGesture,
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const est = this.GE.estimate(hand.keypoints3D, 9);
      if (est.gestures.length > 0) {
        const chosenHand = hand.handedness.toLowerCase() as Hand;
        this.updateDebugInfo(est.poseData, chosenHand);
      }
    }
    // ...and so on
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

  updateDebugInfo(data: GestureDescription[] | string[][], hand: Hand) {
    if (
      data[2][1] === "Half Curl" &&
      data[3][1] === "Half Curl" &&
      !this.isClickStarted[hand]
    ) {
      this.isClickStarted[hand] = true;
      console.log("click started");
    }

    if (
      data[2][1] === "Full Curl" &&
      data[3][1] === "Full Curl" &&
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
