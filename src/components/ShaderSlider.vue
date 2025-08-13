<template>
  <input-panel>
    <h3>Shader Uniform Controls</h3>
    <label>
      Vertex Snap: {{ vertexSnap.toFixed(4) }}
      <div class="flex flex-row justify-items-center">
        <input
          v-model.number="vertexSnap"
          class="mr-1"
          type="range"
          min="0.001"
          max="0.1"
          step="0.001"
          :disabled="!enableVertexSnap"
          @input="update"
        />
        <input v-model="enableVertexSnap" type="checkbox" @input="update" />
      </div>
    </label>

    <label>
      Color Depth: {{ colorDepth }}
      <input
        v-model.number="colorDepth"
        type="range"
        min="1"
        max="32"
        step="1"
        @input="update"
      />
    </label>

    <label>
      Dithering: {{ dithering.toFixed(2) }}
      <input
        v-model.number="dithering"
        type="range"
        min="0"
        max="1"
        step="0.01"
        @input="update"
      />
    </label>

    <label>
      Affine Intensity: {{ affineIntensity.toFixed(2) }}
      <input
        v-model.number="affineIntensity"
        type="range"
        min="0"
        max="1"
        step="0.01"
        @input="update"
      />
    </label>

    <label>
      Pixelation: {{ pixelation }}
      <input
        v-model.number="pixelation"
        type="range"
        min="1"
        max="256"
        step="1"
        @input="update"
      />
    </label>
  </input-panel>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import InputPanel from "./InputPanel.vue";
import type { Uniform } from "three";

// Props: shader uniforms object
const props = defineProps<{
  uniforms: {
    uVertexSnap: Uniform;
    uColorDepth: Uniform;
    uDithering: Uniform;
    uAffineIntensity: Uniform;
    uPixelation: Uniform;
    uEnableVertexSnap: Uniform;
    uMousePosition: Uniform;
  };
}>();

const emit = defineEmits<{
  (e: "updateUniforms", newUniforms: typeof props.uniforms): void;
}>();

function update() {
  emit("updateUniforms", props.uniforms);
}

// Wiring up input values
const uniforms = props.uniforms;
const vertexSnap = ref(uniforms.uVertexSnap.value);
const colorDepth = ref(uniforms.uColorDepth.value);
const dithering = ref(uniforms.uDithering.value);
const affineIntensity = ref(uniforms.uAffineIntensity.value);
const pixelation = ref(uniforms.uPixelation.value);
const enableVertexSnap = ref(uniforms.uEnableVertexSnap.value);

watch(enableVertexSnap, (val) => {
  uniforms.uEnableVertexSnap.value = val;
});

watch(vertexSnap, (val) => {
  uniforms.uVertexSnap.value = val;
});

watch(colorDepth, (val) => {
  uniforms.uColorDepth.value = val;
});

watch(dithering, (val) => {
  uniforms.uDithering.value = val;
});

watch(affineIntensity, (val) => {
  uniforms.uAffineIntensity.value = val;
});

watch(pixelation, (val) => {
  uniforms.uPixelation.value = val;
});
</script>
