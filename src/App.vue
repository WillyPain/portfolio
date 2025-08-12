<script setup lang="ts">
import WebGLCanvas from "./components/WebGLCanvas.vue";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/all";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrambleTextPlugin);
</script>

<template>
  <WebGLCanvas />
</template>
