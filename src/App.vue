<script setup lang="ts">
import MainPage from "./components/MainPage.vue";
import LoadingPage from "./components/LoadingPage.vue";
import gsap from "gsap";
import { ScrambleTextPlugin, ScrollTrigger } from "gsap/all";
import SplitText from "gsap/SplitText";
import { ref } from "vue";
import { ResourceLoader } from "./util/ResourceLoader";
import { TestSceneResources } from "./definitions";
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrambleTextPlugin);

document.getElementById("cursor-container")?.remove();

const loaded = ref(false);
const start = ref(false);

let downloadCount = 0;
ResourceLoader.Instance.Enqueue(
  0,
  () => {
    downloadCount++;
    if (downloadCount == TestSceneResources.length) {
      loaded.value = true;
    }
  },
  ...TestSceneResources
);

setTimeout(() => {
  ResourceLoader.Instance.LoadResources();
}, 1000);
</script>

<template>
  <LoadingPage v-if="!start" :loaded="loaded" @start="start = true" />
  <div v-if="start">
    <MainPage />
  </div>
</template>
