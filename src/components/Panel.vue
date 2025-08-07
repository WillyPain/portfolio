<template>
  <div class="input-panel w-300px p-4 bg-gray-800 rounded-sm">
    <slot></slot>
  </div>
</template>

<style scoped>

:deep(label) {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-family: unispace;
}

:deep(input[type="range"]) {
  width: 100%;
  margin-top: 0.3rem;
  cursor: pointer;
  font-family: unispace;
}
</style>