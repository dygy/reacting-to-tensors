import * as PIXI from "pixi.js";
import { DisplayObject } from "pixi.js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

let plane: PIXI.DisplayObject | PIXI.AnimatedSprite,
  app: PIXI.Application<PIXI.ICanvas>,
  xDirection: "left" | "right" | "none" = "none",
  yDirection: "down" | "up" | "none" = "down",
  reactSetters: {
    setXPosition: Dispatch<SetStateAction<number>>;
    setYPosition: Dispatch<SetStateAction<number>>;
    setLoading?: Dispatch<SetStateAction<boolean>>;
  };
export function usePlane(canvas: HTMLCanvasElement | void) {
  const [loading, setLoading] = useState<boolean>(false);
  const [xPosition, setXPosition] = useState<number>(0);
  const [yPosition, setYPosition] = useState<number>(0);
  reactSetters = {
    setYPosition,
    setXPosition,
    setLoading,
  };

  function changeX(direction: "left" | "right") {
    xDirection = direction;
  }
  useEffect(() => {
    if (!plane) {
      return;
    }

    if (app.screen.width / xPosition > 5 && xDirection === "left") {
      xDirection = "none";
    }

    if (app.screen.width / xPosition < 1.3 && xDirection === "right") {
      console.log(app.screen.width / xPosition);
      xDirection = "none";
    }

    if (app.screen.height / yPosition > 3.8) {
      yDirection = "down";
    }

    if (app.screen.height / yPosition < 1.3) {
      yDirection = "up";
    }
  }, [xPosition, yPosition]);

  useEffect(() => {
    if (!canvas) {
      return;
    }
    app = new PIXI.Application({
      background: "#282c34",
      resizeTo: window,
      view: canvas,
    });
    initPlane();
  }, [canvas]);

  return {
    loading,
    app,
    changeX,
  };
}

function initPlane() {
  reactSetters.setLoading?.(true);
  PIXI.Assets.load("https://pixijs.com/assets/spritesheet/fighter.json").then(
    () => {
      reactSetters.setLoading?.(false);
      // create an array of textures from an image path
      const frames: Array<PIXI.Texture> = [];

      for (let i = 0; i < 30; i++) {
        const val = i < 10 ? `0${i}` : i;

        // magically works since the sprite sheet was loaded with the pixi loader
        const texture = PIXI.Texture.from(`rollSequence00${val}.png`);
        frames.push(texture);
      }

      // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
      plane = new PIXI.AnimatedSprite(frames);

      /*
       * An AnimatedSprite inherits all the properties of a PIXI sprite
       * so you can change its position, its anchor, mask it, etc
       */
      plane.x = app.screen.width / 2;
      plane.y = app.screen.height / 2;
      plane.anchor.set(0.5);
      plane.animationSpeed = 0.5;
      plane.play();
      plane.rotation += 1.5;

      app.stage.addChild(plane as DisplayObject);
      app.ticker.add(animationFunction.bind(window, plane));

      // Animate the rotation
    },
  );
}

const animationFunction = (sprite: PIXI.AnimatedSprite) => {
  if (!sprite) {
    return;
  }
  reactSetters.setXPosition(sprite.x);
  reactSetters.setYPosition(sprite.y);

  if (xDirection === "left") {
    sprite.x -= 0.5;
  }
  if (xDirection === "right") {
    sprite.x += 0.5;
  }

  if (yDirection === "down") {
    sprite.y += 0.5;
  }

  if (yDirection === "up") {
    sprite.y -= 0.5;
  }
};
