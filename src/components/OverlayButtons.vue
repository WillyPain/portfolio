<template>
  <div class="fixed inset-0 pointer-events-none">
    <!-- Bottom left buttons -->
    <div class="absolute bottom-4 left-4 flex gap-10 pointer-events-auto">
      <button class="text-white rounded-none">SMORF</button>
      <button class="text-white">SAVE</button>
      <button class="text-white">EXIT</button>
    </div>

    <!-- Top right PNG -->
    <img :src="png" alt="Icon" class="absolute top-4 right-4 w-16 h-16" />
  </div>
</template>

<script setup lang="ts">
import png from "@/assets/clippy.png?url";
// No reactive logic yet, just layout
</script>

<style>
button {
  border-radius: 0;
}
</style>
