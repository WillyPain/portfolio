<script setup lang="ts">
import WebGLCanvas from "./components/WebGLCanvas.vue";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);
</script>

<template>
  <WebGLCanvas />
</template>
