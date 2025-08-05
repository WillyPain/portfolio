<template>
  <h3>Animation Controls</h3>

  <label>
    Framerate: {{ framerate.toFixed(0) }}
    <input type="range" min="1" max="200" step="1" v-model.number="framerate" @input="update"/>
  </label>

  <label>
    Playback Speed: {{ playbackSpeed.toFixed(1) }}
    <div class="flex flex-row justify-items-center">
      <input class="mr-1" type="range" min="-3" max="3" step="0.1" v-model.number="playbackSpeed" @input="update" :disabled="!enablePlayback"/>
      <input type="checkbox" v-model.bool="enablePlayback" @input="update"/>
    </div>
  </label>

  <label>
    Rotation Speed: {{ rotationSpeed.toFixed(1) }}
    <div class="flex flex-row justify-items-center">
      <input class="mr-1" type="range" min="-3" max="3" step="0.1" v-model.number="rotationSpeed" @input="update" :disabled="!enableRotation"/>
      <input type="checkbox" v-model.bool="enableRotation" @input="update"/>
    </div>
  </label>

  <label>
    Camera Distance: {{ cameraDistance.toFixed(1) }}
    <input type="range" min="0.5" max="4" step="0.1" v-model.number="cameraDistance" @input="update"/>
  </label>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';

// Props: shader uniforms object
const props = defineProps<{
    settings: {
        framerate: number;
        playbackSpeed: number;
        enablePlayback: boolean;
        rotationSpeed: number;
        enableRotation: boolean;
        cameraDistance: number;
    }
}>();

const emit = defineEmits<{
  (e: 'updateAnimationSettings', newUniforms: typeof props.settings): void;
}>();

function update() {
  emit('updateAnimationSettings', props.settings);
}

// On component mount sync initial values with shader
const settings = props.settings;

// Create reactive refs initialized from shader uniforms
const framerate = ref(settings.framerate);
const playbackSpeed = ref(settings.playbackSpeed);
const enablePlayback = ref(settings.enableRotation);
const rotationSpeed = ref(settings.rotationSpeed);
const enableRotation = ref(settings.enableRotation);
const cameraDistance = ref(settings.cameraDistance);

watch(framerate, (val) => {
  settings.framerate = val;
});

watch(playbackSpeed, (val) => {
  settings.playbackSpeed = val;
});

watch(enablePlayback, (val) => {
  settings.enablePlayback = val;
});

watch(rotationSpeed, (val) => {
  settings.rotationSpeed = val;
});

watch(enableRotation, (val) => {
  settings.enableRotation = val;
});

watch(cameraDistance, (val) => {
  settings.cameraDistance = val;
});

</script>

<style scoped>
label {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
input[type="range"] {
  width: 100%;
  margin-top: 0.3rem;
  cursor: pointer;
}
</style>