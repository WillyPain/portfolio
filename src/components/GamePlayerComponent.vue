<template>
  <div class="bg-[#051015] w-full h-full p-5">
    <div
      v-if="!isPlaying"
      class="flex items-center w-full h-full justify-center"
    >
      <button class="w-[400px] h-[300px]" @click="play">
        <p class="text-9xl">PLAY</p>
      </button>
    </div>
    <div v-if="isPlaying" class="absolute object-top-left">
      <button class="w-[100px] h-[50px]" @click="exit">
        <p class="text-xl">EXIT</p>
      </button>
    </div>
    <iframe
      v-if="isPlaying"
      width="100%"
      height="100%"
      :src="iframeUrl"
    ></iframe>
  </div>
  <div
    class="fixed inset-0 pointer-events-none shadow-[inset_0_0_100px_20px_rgba(0,0,0,1)]"
  ></div>
</template>

<script setup lang="ts">
import { MonitorBuilder } from "@/scene/MonitorBuilder";
import { AnimationLoop } from "@/util/AnimationLoop";
import {
  CameraController,
  type CameraBehaviour,
} from "@/util/CameraController";
import { ref } from "vue";

const props = defineProps<{
  iframeUrl: string;
  screenId: string;
}>();

const arcade = new MonitorBuilder(props.screenId);
AnimationLoop.Subscribe(arcade);

const isPlaying = ref(false);
let lastBehaviour: CameraBehaviour = arcade;
function play() {
  isPlaying.value = true;
  lastBehaviour = CameraController.CameraBehaviour;
  CameraController.CameraBehaviour = arcade;
}

function exit() {
  isPlaying.value = false;
  CameraController.CameraBehaviour = lastBehaviour;
}

// on escape or maybe clicking edge of frame or outside of iframe go back and hide player
</script>

<style></style>
