import { GestureDescription, Finger, FingerCurl } from "fingerpose";

// TODO: add more rules
const FullSnapStartGesture = new GestureDescription("full-snap-start");
const HalfSnapStartGesture = new GestureDescription("half-snap-start");
const FullSnapEndGesture = new GestureDescription("full-snap-end");
const HalfSnapEndGesture = new GestureDescription("half-snap-end");

for (const finger of [Finger.Middle, Finger.Pinky, Finger.Ring, Finger.Index]) {
  FullSnapStartGesture.addCurl(finger, FingerCurl.HalfCurl);
}

for (const finger of [Finger.Middle, Finger.Pinky, Finger.Ring, Finger.Index]) {
  FullSnapEndGesture.addCurl(finger, FingerCurl.FullCurl);

  HalfSnapEndGesture.addCurl(finger, FingerCurl.FullCurl);
}

for (const finger of [Finger.Middle, Finger.Index]) {
  HalfSnapStartGesture.addCurl(finger, FingerCurl.HalfCurl);
}

export {
  HalfSnapStartGesture,
  HalfSnapEndGesture,
  FullSnapEndGesture,
  FullSnapStartGesture,
};
