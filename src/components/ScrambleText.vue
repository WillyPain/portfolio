<template>
  <div class="scramble">{{ props.text }}</div>
</template>

<script setup lang="ts">
// Props: shader uniforms object
const props = defineProps<{
  text: string;
}>();
</script>

<style>
.scramble {
  font-family: "Fixedsys", "VT323 Regular", monospace;
  font-style: normal;
  font-weight: 400;
  background-color: #0240ff;
}
</style>
