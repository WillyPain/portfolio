<script setup lang="ts">
import WebGLCanvas from "./components/WebGLCanvas.vue";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrambleTextPlugin);
</script>

<template>
  <WebGLCanvas />
</template>
