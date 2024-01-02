import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import "@tensorflow/tfjs-core";

import { initPlayerVideo } from "@controls/camera";
import * as tf from "@tensorflow/tfjs-core";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import {
  Face,
  MediaPipeFaceMeshMediaPipeModelConfig,
} from "@tensorflow-models/face-landmarks-detection";

let detector: faceLandmarksDetection.FaceLandmarksDetector;
let video: HTMLVideoElement;
let amountStraightEvents = 0;
let positionXLeftIris: number;
let positionYLeftIris: number;
let event: string;

const normalize = (val, max, min) =>
  Math.max(0, Math.min(1, (val - min) / (max - min)));

const isFaceRotated = (landmarks: Face["box"]) => {
  const leftCheek = landmarks.width;
  const rightCheek = landmarks.height;
  const midwayBetweenEyes = landmarks.xMax;

  const xPositionLeftCheek = video.width - leftCheek[0][0];
  const xPositionRightCheek = video.width - rightCheek[0][0];
  const xPositionMidwayBetweenEyes = video.width - midwayBetweenEyes[0][0];

  const widthLeftSideFace = xPositionMidwayBetweenEyes - xPositionLeftCheek;
  const widthRightSideFace = xPositionRightCheek - xPositionMidwayBetweenEyes;

  const difference = widthRightSideFace - widthLeftSideFace;

  if (widthLeftSideFace < widthRightSideFace && Math.abs(difference) > 5) {
    return true;
  } else if (
    widthLeftSideFace > widthRightSideFace &&
    Math.abs(difference) > 5
  ) {
    return true;
  }
  return false;
};

async function renderPrediction() {
  const estimationConfig = {
    flipHorizontal: false,
    returnTensors: false,
    predictIrises: true,
  };
  const predictions = await detector.estimateFaces(video, estimationConfig);

  if (predictions.length > 0) {
    console.log(
      predictions[0].keypoints.filter(({ name }) =>
        Boolean(name?.includes("Iris")),
      ),
    );
    console.log(
      predictions[0].keypoints.filter(({ name }) =>
        Boolean(name?.includes("face")),
      ),
    );
    predictions.forEach((prediction: Face) => {
      positionXLeftIris = prediction.keypoints[0][0];
      positionYLeftIris = prediction.keypoints[0][1];

      const faceBottomLeftX = video.width - prediction.box.xMax[0]; // face is flipped horizontally so bottom right is actually bottom left.
      const faceBottomLeftY = prediction.box.xMax[1];

      const faceTopRightX = video.width - prediction.box.yMin[0]; // face is flipped horizontally so top left is actually top right.
      const faceTopRightY = prediction.box.yMin[1];

      if (faceBottomLeftX > 0 && !isFaceRotated(prediction.box)) {
        const positionLeftIrisX = video.width - positionXLeftIris;
        const normalizedXIrisPosition = normalize(
          positionLeftIrisX,
          faceTopRightX,
          faceBottomLeftX,
        );

        if (normalizedXIrisPosition > 0.355) {
          event = "RIGHT";
        } else if (normalizedXIrisPosition < 0.315) {
          event = "LEFT";
        } else {
          amountStraightEvents++;
          if (amountStraightEvents > 8) {
            event = "STRAIGHT";
            amountStraightEvents = 0;
          }
        }

        const normalizedYIrisPosition = normalize(
          positionYLeftIris,
          faceTopRightY,
          faceBottomLeftY,
        );

        if (normalizedYIrisPosition > 0.62) {
          event = "TOP";
        }
      }
    });
  }
  return event;
}

const loadModel = async () => {
  await tf.setBackend("webgl");
  const config: MediaPipeFaceMeshMediaPipeModelConfig = {
    runtime: "mediapipe",
    refineLandmarks: true,
    maxFaces: 1,
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
  };

  detector = await faceLandmarksDetection.createDetector(
    faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
    config,
  );
};

const setUpCamera = async (videoElement) => {
  video = videoElement;
  return await initPlayerVideo(videoElement);
};

export const gaze = {
  loadModel: loadModel,
  setUpCamera: setUpCamera,
  getGazePrediction: renderPrediction,
};
