<template>
  <Panel>
    <h3>Shader Uniform Controls</h3>
    <label>
      Vertex Snap: {{ vertexSnap.toFixed(4) }}
      <div class="flex flex-row justify-items-center">
        <input class="mr-1" type="range" min="0.001" max="0.1" step="0.001" v-model.number="vertexSnap" @input="update" :disabled="!enableVertexSnap"/>
        <input type="checkbox" v-model.bool="enableVertexSnap" @input="update"/>
      </div>
    </label>

    <label>
      Color Depth: {{ colorDepth }}
      <input type="range" min="1" max="32" step="1" v-model.number="colorDepth" @input="update"/>
    </label>

    <label>
      Dithering: {{ dithering.toFixed(2) }}
      <input type="range" min="0" max="1" step="0.01" v-model.number="dithering" @input="update"/>
    </label>

    <label>
      Affine Intensity: {{ affineIntensity.toFixed(2) }}
      <input type="range" min="0" max="1" step="0.01" v-model.number="affineIntensity" @input="update"/>
    </label>

    <label>
      Pixelation: {{ pixelation }}
      <input type="range" min="1" max="256" step="1" v-model.number="pixelation" @input="update"/>
    </label>
  </Panel>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import Panel from './Panel.vue';

// Props: shader uniforms object
const props = defineProps<{
  uniforms: {
    uVertexSnap: { value: number };
    uColorDepth: { value: number };
    uDithering: { value: number };
    uAffineIntensity: { value: number };
    uPixelation: { value: number };
    uEnableVertexSnap: { value: boolean };
  };
}>();

const emit = defineEmits<{
  (e: 'updateUniforms', newUniforms: typeof props.uniforms): void;
}>();

function update() {
  emit('updateUniforms', props.uniforms);
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