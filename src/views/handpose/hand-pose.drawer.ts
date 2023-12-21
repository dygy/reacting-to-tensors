import { createDetector, SupportedModels } from "@tensorflow-models/hand-pose-detection"
import { Gestures, GestureEstimator, GestureDescription } from "fingerpose"
import { PixelInput } from "@tensorflow-models/hand-pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import React, {useEffect, useState} from "react";

let handler: null | React.Dispatch<any> = null;
const config = {
    video: { width: 640, height: 480, fps: 10 }
};

const landmarkColors = {
    thumb: "red",
    index: "blue",
    middle: "yellow",
    ring: "green",
    pinky: "pink",
    wrist: "white"
};

async function createDetectorLocal() {
    return createDetector(
        SupportedModels.MediaPipeHands,
        {
            runtime: "mediapipe",
            modelType: "full",
            maxHands: 2,
            solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915`
        }
    );
}


async function initCamera(video: HTMLVideoElement, width: number, height: number, fps: number): Promise<HTMLVideoElement> {
    const constraints = {
        audio: false,
        video: {
            facingMode: "user",
            width,
            height,
            frameRate: { max: fps }
        }
    };

    video.width = width;
    video.height = height;
    // get video stream
    video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);


    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

function drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

const isClickStarted = {
    left: false,
    right: false
};

async function main(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");

    // configure gesture estimator
    // add "✌🏻" and "👍" as sample gestures
    const knownGestures = [
        Gestures.VictoryGesture,
        Gestures.ThumbsUpGesture
    ];
    const GE = new GestureEstimator(knownGestures);
    // load handpose model
    const detector = await createDetectorLocal();
    console.log("mediaPose model loaded");

    // main estimation loop
    const estimateHands = async () => {
        // clear canvas overlay
        ctx?.clearRect(0, 0, config.video.width, config.video.height);

        // get hand landmarks from video
        if (video && ctx) {
            const hands = await detector.estimateHands(video as PixelInput, {
                flipHorizontal: true
            });

            for (const hand of hands) {
                for (const keypoint of hand.keypoints) {
                    const name = keypoint.name?.split("_")[0].toString().toLowerCase();
                    if (name) {
                        const color = landmarkColors[name];
                        drawPoint(ctx, keypoint.x, keypoint.y, 3, color);
                    }
                }

                // @ts-ignore
                const est = GE.estimate(hand.keypoints3D, 9);
                if (est.gestures.length > 0) {
                    // find gesture with the highest match score
                    let result = est.gestures.reduce((p, c) => {
                        return p.score > c.score ? p : c;
                    });
                    const chosenHand = hand.handedness.toLowerCase();
                    updateDebugInfo(est.poseData, chosenHand);
                }
            }
            // ...and so on
            setTimeout(() => {
                estimateHands();
            }, 1000 / config.video.fps);
        }
    };

    await estimateHands();
    console.log("Starting predictions");
}
function updateDebugInfo(data: GestureDescription[] | string[][], hand: string) {
    if (
        data[2][1] === "Half Curl" &&
        data[3][1] === "Half Curl" &&
        !isClickStarted[hand]
    ) {
        isClickStarted[hand] = true;
        console.log("click started");
    }

    if (
        data[2][1] === "Full Curl" &&
        data[3][1] === "Full Curl" &&
        isClickStarted[hand]
    ) {
        isClickStarted[hand] = false;
        handler?.({
            clicked: true,
            hand
        })
        setTimeout(()=> {
            handler?.({
                clicked: false,
                hand: undefined
            })
        }, 1000)
        console.log("click ended");
    }
}

export const useFingersClicks = () => {
    const [clickedState, setClickedState] = useState<{
        clicked: boolean, hand: "left" | "right" | undefined
    }>({
        clicked: false,
        hand: undefined
    })


    useEffect(() => {
        const [video, canvas] = [
            document.getElementById("video") as HTMLVideoElement,
            document.getElementById("canvas") as HTMLCanvasElement
        ]

        if (video && canvas && !handler) {
            handler = setClickedState;
            initCamera(video, config.video.width, config.video.height, config.video.fps).then(
                (video) => {
                    void video.play();
                    video.addEventListener("loadeddata", (event) => {
                        console.log("Camera is ready");
                        void main(video, canvas);
                    });
                }
            );

            if (canvas) {
                canvas.width = config.video.width;
                canvas.height = config.video.height;
            }
            console.log("Canvas initialized");
        }
    }, []);

    return clickedState
};
