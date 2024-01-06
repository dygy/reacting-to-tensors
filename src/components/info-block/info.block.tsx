import { routes } from "@base/router";
import {
  eyecontactasino,
  handPosePlane,
  rockPapperScissors,
} from "@components/info-block/assets";

import { ElementType } from "react";

import styles from "./info-block.module.scss";
type Props = {
  gameplay: string;
  title: string;
  href: string;
};

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const desctiptions: Record<ArrayElement<typeof routes>["id"], string> = {
  "hand-pose plane":
    "Hand pose plane is a game where you can snap fingers to control plane",
  "rock paper scissors":
    "classic game with rock, paper and scissor against robot via your hands",
  "eye contactasino":
    "eye contactasino is a slot machine that are controlled via eye tracking",
};

const videos: Record<ArrayElement<typeof routes>["id"], string> = {
  "hand-pose plane": handPosePlane,
  "rock paper scissors": rockPapperScissors,
  "eye contactasino": eyecontactasino,
};

export const InfoBlock = ({ title, gameplay, href }: Props) => {
  return (
    <div className={styles.block}>
      <h1>{title}</h1>
      <video controls>
        <source src={videos[title]} type="video/mp4" />
      </video>
      <p>{desctiptions[title]}</p>
      <br />
      <a href={href}>check it out</a>
    </div>
  );
};
