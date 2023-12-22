import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  createDetector,
  HandDetector,
  SupportedModels,
} from "@tensorflow-models/hand-pose-detection";
import { Gestures, GestureEstimator, GestureDescription } from "fingerpose";
import type { PixelInput } from "@tensorflow-models/hand-pose-detection/dist/shared/calculators/interfaces/common_interfaces";

type StateDispatch = Dispatch<
  SetStateAction<{ clicked: boolean; hand: "left" | "right" | undefined }>
>;
let handPoseDrawer: HandPoseDrawer | null = null;

class HandPoseDrawer {
  private isClickStarted = {
    left: false,
    right: false,
  };
  public config = {
    video: { width: 640, height: 480, fps: 10 },
  };
  private canvas: HTMLCanvasElement;
  private video: HTMLVideoElement;
  private knownGestures: GestureDescription[];
  private handler: StateDispatch;
  private worker: Worker;

  constructor(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    handler: StateDispatch,
  ) {
    this.video = video;
    this.canvas = canvas;
    this.handler = handler;
    // configure gesture estimator
    // add "✌🏻" and "👍" as sample gestures
    this.knownGestures = [Gestures.VictoryGesture, Gestures.ThumbsUpGesture];
    this.worker = new Worker(new URL("./worker.ts", import.meta.url));
    this.worker.onmessage = (message) => {
      console.log(message);
    };
    this.worker.postMessage({
      message: "init",
    });
  }

  async initCamera(): Promise<HTMLVideoElement> {
    const constraints = {
      audio: false,
      video: {
        facingMode: "user",
        video: this.video,
        height: this.config.video.height,
        frameRate: { max: this.config.video.fps },
      },
    };

    this.video.width = this.config.video.width;
    this.video.height = this.config.video.height;
    // get video stream
    this.video.srcObject =
      await navigator.mediaDevices.getUserMedia(constraints);

    return new Promise((resolve) => {
      this.video.onloadedmetadata = () => {
        resolve(this.video);
        void this.main();
      };
    });
  }

  async estimateHands(detector: HandDetector) {
    // clear canvas overlay
    const ctx = this.canvas.getContext("2d");
    if (ctx) {
      const GE = new GestureEstimator(this.knownGestures);
      ctx.clearRect(0, 0, this.config.video.width, this.config.video.height);

      // get hand landmarks from video
      const hands = await detector.estimateHands(this.video as PixelInput, {
        flipHorizontal: true,
      });

      for (const hand of hands) {
        // @ts-ignore
        const est = GE.estimate(hand.keypoints3D, 9);
        if (est.gestures.length > 0) {
          // find gesture with the highest match score
          let result = est.gestures.reduce((p, c) => {
            return p.score > c.score ? p : c;
          });
          const chosenHand = hand.handedness.toLowerCase() as "left" | "right";
          this.updateDebugInfo(est.poseData, chosenHand);
        }
      }
      // ...and so on
      setTimeout(() => {
        void this.estimateHands(detector);
      }, 1000 / this.config.video.fps);
    }
  }
  async main() {
    // load handpose model
    const detector = await this.createDetectorLocal();
    console.log("mediaPose model loaded");

    await this.estimateHands(detector);
    console.log("Starting predictions");
  }

  async createDetectorLocal() {
    return createDetector(SupportedModels.MediaPipeHands, {
      runtime: "mediapipe",
      modelType: "full",
      maxHands: 2,
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915`,
    });
  }
  updateDebugInfo(
    data: GestureDescription[] | string[][],
    hand: "left" | "right",
  ) {
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
export const useFingersClicks = () => {
  const [clickedState, setClickedState] = useState<{
    clicked: boolean;
    hand: "left" | "right" | undefined;
  }>({
    clicked: false,
    hand: undefined,
  });

  useEffect(() => {
    const [video, canvas] = [
      document.getElementById("video") as HTMLVideoElement,
      document.getElementById("canvas") as HTMLCanvasElement,
    ];

    if (!handPoseDrawer) {
      handPoseDrawer = new HandPoseDrawer(video, canvas, setClickedState);
      handPoseDrawer.initCamera().then((video) => {
        void video.play();
        video.addEventListener("loadeddata", (event) => {
          console.log("Camera is ready");
        });
      });

      if (canvas) {
        canvas.width = handPoseDrawer.config.video.width;
        canvas.height = handPoseDrawer.config.video.height;
      }
      console.log("Canvas initialized");
    }
  }, []);

  return clickedState;
};
