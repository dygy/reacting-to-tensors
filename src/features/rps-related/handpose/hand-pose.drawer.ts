import "@tensorflow/tfjs-backend-webgl";
import { createDetectorLocal } from "@controls/tensorflow";
import { HandDetector } from "@tensorflow-models/hand-pose-detection";
import type { PixelInput } from "@tensorflow-models/hand-pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import { GestureDescription, GestureEstimator } from "fingerpose";

import { RockGesture, PaperGesture, ScissorsGesture } from "./gesture.inits";

// store references

class HandPoseDrawer {
  private knownGestures: GestureDescription[] = [
    RockGesture,
    PaperGesture,
    ScissorsGesture,
  ];
  private GE: GestureEstimator = new GestureEstimator(this.knownGestures);
  private detector?: HandDetector;

  async init() {
    // initialize finger gesture recognizer with known gestures
    this.detector = await createDetectorLocal();
  }

  async predictGesture(sourceElement: HTMLVideoElement, minimumScore: number) {
    if (!this.detector) {
      return "";
    }

    const hands = await this.detector.estimateHands(
      sourceElement as PixelInput,
      {
        flipHorizontal: true,
      },
    );

    for (const hand of hands) {
      const gestureEstimations = this.GE.estimate(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        hand.keypoints3D,
        minimumScore,
      );

      // get gesture with highest match score
      if (gestureEstimations.gestures.length > 0) {
        // this will reduce an array of results to a single value
        // containing only the gesture with the highest score
        const gestureResult = gestureEstimations.gestures.reduce((p, c) => {
          return p.score > c.score ? p : c;
        });
        return gestureResult.name;
      }
    }

    return "";
  }
}

export const handPoseDrawer = new HandPoseDrawer();
