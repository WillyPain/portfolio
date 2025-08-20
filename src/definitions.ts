// not a huge fan of these symbols, might need some work
export const letterToSpecialChars: Map<string, string[]> = new Map([
  ["A", ["@", "4", "▲", "∆", "α", "Å", "λ"]],
  ["B", ["8", "3", "ß", "Þ", "β"]],
  ["C", ["(", "©", "¢", "<", "Ƈ", "Ç"]],
  ["D", ["Ð", "∂", "Ɗ"]],
  ["E", ["3", "€", "£", "Σ", "Ǝ"]],
  ["F", ["ƒ", "ϝ"]],
  ["G", ["6", "9", "&", "ɢ"]],
  ["H", ["#", "ħ", "ɦ", ":"]],
  ["I", ["!", "1", "|", "l", "ɩ", ":"]],
  ["J", ["_|", "¿", "ʝ"]],
  ["K", ["κ", "к"]],
  ["L", ["1", "£", "∟"]],
  ["M", ["/", "^", "ɱ", "%,", "*"]],
  ["N", ["ɲ", "^", "*", "#"]],
  ["O", ["0", "°", "ø", "@", "."]],
  ["P", ["|*", "|>", "ρ", "þ", "ϱ"]],
  ["Q", ["0,", "9", "(,)", "ʠ"]],
  ["R", ["®", "ʀ", "-"]],
  ["S", ["$", "5", "§", "ś", "š"]],
  ["T", ["7", "+", "†", "‡"]],
  ["U", ["µ", "ʉ"]],
  ["V", ["ʋ", "@", "^"]],
  ["W", ["v", "ɯ"]],
  ["X", ["×", "ẋ", "χ"]],
  ["Y", ["`", "¥", "ɏ"]],
  ["Z", ["2", "7", "≥", "ƶ"]],
]);

export const genericGlitchCharacters = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "+",
];

import pcNoScreen from "@/assets/models/pc-no-screen.glb?url";
import typingModelUrl from "@/assets/models/typing.glb?url";
import redScreenVideo from "@/assets/video/crt.mp4?url";
import screenVideo from "@/assets/video/screen-1.mp4?url";
import fingerprintTexture from "@/assets/textures/screen/fingerprints.png?url";
import screenReflextionTexture from "@/assets/textures/screen/reflection.jpg?url";

import type { Texture } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";

export const ResourceUrls = {
  screenVideo: screenVideo,
  redScreenVideo: redScreenVideo,
  fingerprintTexture: fingerprintTexture,
  screenReflextionTexture: screenReflextionTexture,
  pc: pcNoScreen,
} as const;

export type ResourceEntry = {
  url: string;
  type: ResourceType;
};
export type MediaResource =
  | GLTF
  | HTMLVideoElement
  | HTMLAudioElement
  | Texture;
export const ResourceTypes = {
  Audio: "AUDIO",
  GLTF: "GLB",
  GLSL: "GLSL",
  Video: "VIDEO",
  Texture: "TEXTURE",
} as const;

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];

export const TestSceneResources: ResourceEntry[] = [
  { url: typingModelUrl, type: ResourceTypes.GLTF },
  { url: ResourceUrls.pc, type: ResourceTypes.GLTF },
  { url: ResourceUrls.redScreenVideo, type: ResourceTypes.Video },
  { url: ResourceUrls.screenVideo, type: ResourceTypes.Video },
  { url: ResourceUrls.fingerprintTexture, type: ResourceTypes.Texture },
  { url: ResourceUrls.screenReflextionTexture, type: ResourceTypes.Texture },
];
