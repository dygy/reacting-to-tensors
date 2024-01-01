import {
  createDetector,
  SupportedModels,
} from "@tensorflow-models/hand-pose-detection";

export async function createDetectorLocal() {
  return createDetector(SupportedModels.MediaPipeHands, {
    runtime: "mediapipe",
    modelType: "full",
    maxHands: 2,
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915`,
  });
}
