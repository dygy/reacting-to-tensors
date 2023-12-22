export {};
const ctx: Worker = self as any; // eslint-disable-line no-restricted-globals

onmessage = async (event) => {
    console.log("event data", event.data)
    if (event.data.message === "draw") {
        drawPoint()
    }
};

function drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
