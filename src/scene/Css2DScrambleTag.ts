import type { Object3D } from "three";
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { render, createVNode } from "vue";
import ScrambleTextLabel from "@/components/ScrambleTextLabel.vue";

export class Css2DScrambleTag {
  parent: Object3D;
  text: string;
  domElement: HTMLElement;
  css2dObject: CSS2DObject;
  constructor(parent: Object3D, text: string) {
    this.parent = parent;
    this.text = text;
    const vnode = createVNode(ScrambleTextLabel, { text: text });
    this.domElement = document.createElement("div");
    render(vnode, this.domElement);
    this.css2dObject = new CSS2DObject(this.domElement);
    parent.add(this.css2dObject);
  }
}
