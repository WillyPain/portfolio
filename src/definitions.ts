import pcNoScreen from "@/assets/models/pc-no-screen.glb?url";
import cribUrl from "@/assets/models/crib.glb?url";
import sk8rUrl from "@/assets/models/sk8r.glb?url";
import arcadeModelUrl from "@/assets/models/arcade.glb?url";
import spaceArcadeModelUrl from "@/assets/models/space_arcade.glb?url";
import typingModelUrl from "@/assets/models/typing.glb?url";
import crtVideo from "@/assets/video/crt.mp4?url";
import screenVideo from "@/assets/video/screen-1.mp4?url";
import vhsVideo from "@/assets/video/vhs-overlay.mp4?url";
// import vhsBlueVideo from "@/assets/video/vhs_blue_short.mp4?url";
// import vhsStaticVideo from "@/assets/video/vhs_static.mp4?url";
import stolen_main from "@/assets/video/stolen_main.mp4?url";
import stolen_second from "@/assets/video/stolen_second.mp4?url";
import fingerprintTexture from "@/assets/textures/screen/fingerprints.png?url";
import screenReflextionTexture from "@/assets/textures/screen/reflection.jpg?url";
import music from "@/assets/audio/music/crushed.ogg?url";
import skateboardSfx from "@/assets/audio/sfx/skateboard.ogg";
import skateboardGrindingSfx from "@/assets/audio/sfx/skateboard_grind_2.ogg?url";
import cameraTrackPathData from "@/assets/curves/crib_cam_2.json?raw";
import focusPointsPathData from "@/assets/curves/focus_points.json?raw";
import catTrackPathData from "@/assets/curves/cat_track.json?raw";
import cribLightmapUrl from "@/assets/textures/lightmaps/whole_crib_bake.avif?url";

import {
  CatmullRomCurve3,
  Uniform,
  Vector2,
  Vector3,
  type Texture,
} from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";

// not a huge fan of these symbols, might need some work
export const letterToSpecialChars: Map<string, string[]> = new Map([
  ["A", ["@", "4", "▲", "∆", "α", "Å", "λ"]],
  ["B", ["8", "3", "ß", "Þ", "β"]],
  ["C", ["(", "©", "¢", "<", "Ƈ", "Ç"]],
  ["D", ["d", "δ"]],
  ["E", ["3", "€", "£", "Σ", "Ǝ"]],
  ["F", ["ƒ", "ϝ"]],
  ["G", ["6", "9", "&", "ɢ"]],
  ["H", ["#", "ħ", "ɦ", ":"]],
  ["I", ["!", "1", "|", "l", ":"]],
  ["J", ["_|", "¿", "ʝ"]],
  ["K", ["κ", "к"]],
  ["L", ["1", "£"]],
  ["M", ["/", "^", "ɱ", "%,", "*"]],
  ["N", ["ɲ", "^", "*", "#"]],
  ["O", ["0", "°", "ø", "@", "."]],
  ["P", ["|*", "|>", "ρ", "þ", "ϱ"]],
  ["Q", ["0,", "9", "(,)", "ʠ"]],
  ["R", ["®", "-"]],
  ["S", ["$", "5", "§", "ś", "š"]],
  ["T", ["7", "+", "†", "‡"]],
  ["U", ["µ", "ʉ"]],
  ["V", ["ʋ", "@", "^"]],
  ["W", ["v"]],
  ["X", ["×", "ẋ", "χ"]],
  ["Y", ["`", "¥", "ɏ"]],
  ["Z", ["2", "7", "≥", "ƶ"]],
  ["0", ["*"]],
  ["1", ["]", "[", "/"]],
  ["2", ["z", "²"]],
  ["3", ["Σ", "≡"]],
  ["4", ["A"]],
  ["5", ["$"]],
  ["6", ["δ", "¿"]],
  ["7", ["]"]],
  ["8", ["&"]],
  ["9", ["?"]],
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

export const ResourceUrls = {
  wavingDistortionVideo: screenVideo,
  crtVideo: crtVideo,
  vhsVideo: vhsVideo,
  // vhsBlueVideo: vhsBlueVideo,
  // vhsStaticVideo: vhsStaticVideo,
  vhsBlueVideo: stolen_second,
  vhsStaticVideo: stolen_main,
  fingerprintTexture: fingerprintTexture,
  screenReflectionTexture: screenReflextionTexture,
  pc: pcNoScreen,
  sk8r: sk8rUrl,
  crib: cribUrl,
  typing: typingModelUrl,
  arcade: arcadeModelUrl,
  spaceArcade: spaceArcadeModelUrl,
  music: music,
  skateboardSfx: skateboardSfx,
  skateboardGrindingSfx: skateboardGrindingSfx,
  cribLightmap: cribLightmapUrl,
};

export const curves = {
  cameraTrack: smoothEvenCurve(
    createCurveFromJSON(JSON.parse(cameraTrackPathData), true)
  ),
  catTrack: smoothEvenCurve(
    createCurveFromJSON(JSON.parse(catTrackPathData)),
    0.5
  ),
  focusPoints: createCurveFromJSON(JSON.parse(focusPointsPathData)),
};

export type ResourceEntry = {
  url: string;
  //todo: I dont think this is being used for anything? maybe remove
  type: ResourceType;
};
export type MediaResource = GLTF | HTMLVideoElement | AudioBuffer | Texture;
export const ResourceTypes = {
  Audio: "AUDIO",
  GLTF: "GLB",
  GLSL: "GLSL",
  Video: "VIDEO",
  Texture: "TEXTURE",
};

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];

export const TestSceneResources: ResourceEntry[] = [
  { url: ResourceUrls.typing, type: ResourceTypes.GLTF },
  { url: ResourceUrls.pc, type: ResourceTypes.GLTF },
  { url: ResourceUrls.crtVideo, type: ResourceTypes.Video },
  { url: ResourceUrls.wavingDistortionVideo, type: ResourceTypes.Video },
  { url: ResourceUrls.vhsVideo, type: ResourceTypes.Video },
  { url: ResourceUrls.vhsBlueVideo, type: ResourceTypes.Video },
  { url: ResourceUrls.vhsStaticVideo, type: ResourceTypes.Video },
  { url: ResourceUrls.fingerprintTexture, type: ResourceTypes.Texture },
  { url: ResourceUrls.screenReflectionTexture, type: ResourceTypes.Texture },
  { url: ResourceUrls.cribLightmap, type: ResourceTypes.Texture },
  { url: ResourceUrls.music, type: ResourceTypes.Audio },
  { url: ResourceUrls.skateboardSfx, type: ResourceTypes.Audio },
  { url: ResourceUrls.skateboardGrindingSfx, type: ResourceTypes.Audio },
  { url: ResourceUrls.arcade, type: ResourceTypes.GLTF },
  { url: ResourceUrls.spaceArcade, type: ResourceTypes.GLTF },
  { url: ResourceUrls.crib, type: ResourceTypes.GLTF },
  { url: ResourceUrls.sk8r, type: ResourceTypes.GLTF },
];

export class Ps1ShaderUniforms {
  [key: string]: Uniform;
  uEnableVertexSnap = new Uniform(true);
  uVertexSnap = new Uniform(0.03);
  uColorDepth = new Uniform(10);
  uDithering = new Uniform(0.5);
  uAffineIntensity = new Uniform(1);
  uPixelation = new Uniform(2048);
  uMousePosition = new Uniform(new Vector2(0, 0));
}

export interface ThreeShader {
  vertexShader: string;
  fragmentShader: string;
  uniforms: {
    [key: string]: Uniform;
  };
}

// Ganked code from https://github.com/ClassOutside/Blender_Path_To_ThreeJS/blob/main/src/curveTools/CurveMethods.js
function createCurveFromJSON(
  json: {
    points: Vector3[];
    closed: boolean;
  },
  reverse = false
): CatmullRomCurve3 {
  const vertices = json.points;
  const points = [];

  for (let i = 0; i < vertices.length; i += 1) {
    const x = vertices[i].x;
    const y = vertices[i].y;
    const z = vertices[i].z;
    points.push(new Vector3(x, y, z));
  }
  if (reverse) {
    points.reverse();
  }
  return new CatmullRomCurve3(points);
}

function smoothEvenCurve(
  curve: CatmullRomCurve3,
  smoothingFactor = 1
): CatmullRomCurve3 {
  return new CatmullRomCurve3(
    curve.getSpacedPoints(Math.floor(curve.points.length * smoothingFactor))
  );
}
