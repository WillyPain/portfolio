<script setup lang="ts">
import WebGLCanvas from "./components/MainPage.vue";
import gsap from "gsap";
import { ScrambleTextPlugin, ScrollTrigger } from "gsap/all";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrambleTextPlugin);
</script>

<template>
  <WebGLCanvas />
</template>
