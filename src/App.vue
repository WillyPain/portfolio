<script setup lang="ts">
import WebGLCanvas from './components/WebGLCanvas.vue'
import gsap from 'gsap';
import SplitText from 'gsap/SplitText'

gsap.registerPlugin(SplitText);
</script>

<template>
  <WebGLCanvas/>
</template>
