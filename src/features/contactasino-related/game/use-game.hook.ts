import {
  papich,
  pepega,
  van,
} from "@features/contactasino-related/game/assets";
import { debounce } from "lodash";
import * as PIXI from "pixi.js";
import {
  Application,
  BlurFilter,
  Container,
  DisplayObject,
  ICanvas,
  Sprite,
} from "pixi.js";

import { useEffect, useState } from "react";

type Reel = {
  container: Container;
  symbols: Array<Sprite>;
  position: number;
  previousPosition: number;
  blur: BlurFilter;
};

type Tween = {
  object: Reel;
  property: string;
  propertyBeginValue: number;
  target: number;
  easing: (amount: number) => number;
  time: number;
  change?: (tween: Tween) => void;
  complete?: (tween: Tween) => void;
  start: number;
};

export const useGameHook = (
  canvasRef: HTMLCanvasElement | null,
  eyeContact: number,
) => {
  const debouncedStart = debounce(startPlay, 2000);
  const [localCount, setCount] = useState<number>(0);
  const [isInited, setInited] = useState<boolean>(false);
  useEffect(() => {
    if (canvasRef && !isInited) {
      init(canvasRef);
      setInited(true);
    }
  }, [canvasRef, isInited]);
  useEffect(() => {
    if (eyeContact > localCount) {
      setCount(eyeContact);
      debouncedStart();
    }
  }, [eyeContact, localCount]);
};

const reels: Array<Reel> = [];
function init(canvas: ICanvas) {
  const app = new PIXI.Application({
    background: "#61dafb",
    view: canvas,
    resizeTo: window,
  });
  // Listen for animate update.
  app.ticker.add((delta) => {
    const now = Date.now();
    const remove: Array<Tween> = [];

    tweening.forEach((tween) => {
      const phase = Math.min(1, (now - tween.start) / tween.time);
      tween.object[tween.property] = lerp(
        tween.propertyBeginValue,
        tween.target,
        tween.easing(phase),
      );
      if (tween.change) tween.change(tween);
      if (phase === 1) {
        tween.object[tween.property] = tween.target;
        if (tween.complete) tween.complete(tween);
        remove.push(tween);
      }
    });
    remove.forEach((item) => {
      tweening.splice(tweening.indexOf(item), 1);
    });
  });
  PIXI.Assets.load([papich, van, pepega]).then(() => onAssetsLoaded(app));
}

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 160;

let running = false;

function onAssetsLoaded(app: Application) {
  const slotTextures = [
    PIXI.Texture.from(papich),
    PIXI.Texture.from(pepega),
    PIXI.Texture.from(van),
  ];

  // Build the reels
  const reelContainer = new PIXI.Container();

  for (let i = 0; i < 3; i++) {
    const rc = new PIXI.Container();

    rc.x = i * REEL_WIDTH;
    reelContainer.addChild(rc as DisplayObject);

    const reel: Reel = {
      container: rc,
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new PIXI.BlurFilter(),
    };

    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

    // Build the symbols
    for (let j = 0; j < 4; j++) {
      const symbol = new PIXI.Sprite(
        slotTextures[Math.floor(Math.random() * slotTextures.length)],
      );
      // Scale the symbol to fit symbol area.

      symbol.y = j * SYMBOL_SIZE;
      symbol.scale.x = symbol.scale.y = Math.min(
        SYMBOL_SIZE / symbol.width,
        SYMBOL_SIZE / symbol.height,
      );
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      reel.symbols.push(symbol);
      rc.addChild(symbol as DisplayObject);
    }
    reels.push(reel);
  }
  app.stage.addChild(reelContainer as DisplayObject);

  // Build top & bottom covers and position reelContainer
  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

  reelContainer.y = margin;
  reelContainer.x = app.screen.width / 2.2 - REEL_WIDTH;
  const top = new PIXI.Graphics();

  top.beginFill(0, 1);
  top.drawRect(0, 0, app.screen.width, margin);
  const bottom = new PIXI.Graphics();

  bottom.beginFill(0, 1);
  bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);

  // Add play text
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fontStyle: "italic",
    fontWeight: "bold",
    fill: ["#61dafb", "#94e1f6"], // gradient
    stroke: "#444",
    strokeThickness: 3,
    dropShadow: true,
    dropShadowColor: "#555",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
  });

  const playText = new PIXI.Text("roll your eyes up!", style);

  playText.x = Math.round((bottom.width - playText.width) / 2);
  playText.y =
    app.screen.height - margin + Math.round((margin - playText.height) / 2);
  bottom.addChild(playText as DisplayObject);

  // Add header text
  const headerText = new PIXI.Text("TRASH SLOT MACHINE!", style);

  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);
  top.addChild(headerText as DisplayObject);

  app.stage.addChild(top as DisplayObject);
  app.stage.addChild(bottom as DisplayObject);

  bottom.eventMode = "static";

  app.ticker.add((delta) => {
    reels.forEach((reel) => {
      reel.blur.blurY = (reel.position - reel.previousPosition) * 8;
      reel.previousPosition = reel.position;
      reel.symbols.forEach((symbol, index) => {
        const prevy = symbol.y;

        symbol.y =
          ((reel.position + index) % reel.symbols.length) * SYMBOL_SIZE -
          SYMBOL_SIZE;
        if (symbol.y < 0 && prevy > SYMBOL_SIZE) {
          // Detect going over and swap a texture.
          // This should in proper product be determined from some logical reel.
          symbol.texture =
            slotTextures[Math.floor(Math.random() * slotTextures.length)];
          symbol.scale.x = symbol.scale.y = Math.min(
            SYMBOL_SIZE / symbol.texture.width,
            SYMBOL_SIZE / symbol.texture.height,
          );
          symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        }
      });
    });
  });
}

// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
const tweening: Array<Tween> = [];

function tweenTo(
  object: Reel,
  property: string,
  target: number,
  time: number,
  easing: (t: number) => number,
  onchange: Tween["change"],
  oncomplete: Tween["complete"],
) {
  const tween = {
    object,
    property,
    propertyBeginValue: object[property],
    target,
    easing,
    time,
    change: onchange,
    complete: oncomplete,
    start: Date.now(),
  };

  tweening.push(tween);

  return tween;
}

// Basic lerp funtion.
function lerp(a1: number, a2: number, t: number) {
  return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
function backout(amount: number): (t: number) => number {
  return (t) => --t * t * ((amount + 1) * t + amount) + 1;
}

function startPlay() {
  if (running) return;
  running = true;

  reels.forEach((reel, index) => {
    const extra = Math.floor(Math.random() * 3);
    const target = reel.position + 10 + index * 3 + extra;
    const time = 2500 + index * 600 + extra * 600;

    tweenTo(
      reel,
      "position",
      target,
      time,
      backout(0.5),
      undefined,
      index === reels.length - 1 ? reelsComplete : undefined,
    );
  });
}
function reelsComplete() {
  running = false;
}
