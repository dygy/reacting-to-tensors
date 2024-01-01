import config from "@controls/camera/config";
export const initPlayerVideo = async (playerRef: HTMLVideoElement) => {
  // get cam video stream
  playerRef.srcObject = await navigator.mediaDevices.getUserMedia(config);

  return new Promise((resolve) => {
    playerRef.onloadedmetadata = () => {
      playerRef.onloadeddata = () => {
        playerRef.play().then(() => {
          resolve(playerRef);
        });
      };
    };
  });
};
