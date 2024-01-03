import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import "@tensorflow/tfjs-core";

import { initPlayerVideo } from "@controls/camera";
import * as tf from "@tensorflow/tfjs-core";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { MediaPipeFaceMeshMediaPipeModelConfig } from "@tensorflow-models/face-landmarks-detection";

let detector: faceLandmarksDetection.FaceLandmarksDetector;
let video: HTMLVideoElement;
let leftEyeIrisY: number;

async function renderPrediction(isLog?: boolean) {
  let event = "DOWN";
  const estimationConfig = {
    flipHorizontal: false,
    returnTensors: false,
    predictIrises: true,
  };
  const predictions = await detector.estimateFaces(video, estimationConfig);

  if (predictions.length > 0) {
    if (isLog ?? false) {
      console.log(
        predictions[0].keypoints.filter(({ name }) =>
          Boolean(name?.includes("Iris")),
        ),
      );
    }

    predictions.forEach((prediction) => {
      const leftEyeIris = prediction.keypoints.find(({ name }) =>
        Boolean(name?.includes("leftIris")),
      );
      const leftEye = prediction.keypoints.find(({ name }) =>
        Boolean(name?.includes("leftEye")),
      );
      /*
      console.log(
        prediction.keypoints
          .filter(({ name }) => name !== undefined)
          .map(({ name }) => name),
      );
       */

      if (!leftEyeIris || !leftEye) {
        return;
      }

      leftEyeIrisY = leftEyeIris.y;

      const leftEyeY = leftEye.y;

      const normalizedYIrisPosition = leftEyeY - leftEyeIrisY;

      console.log(normalizedYIrisPosition);

      if (normalizedYIrisPosition > 4.5) {
        event = "UP";
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
