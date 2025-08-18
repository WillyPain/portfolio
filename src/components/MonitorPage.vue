<template>
  <div
    id="monitor"
    class="w-[120vh] h-[100vh] overflow-auto bg-black text-emerald-300 relative p-50"
  >
    <div class="scrollTarget"></div>
    <h1>anyone home?</h1>
    <scramble-text-label :text="`MODESTY`" color="yellow"></scramble-text-label>
    <h1>anyone home?</h1>
    <scramble-text-label :text="`MODESTY`" color="yellow"></scramble-text-label>
    <scramble-text-label :text="`MODESTY`" color="yellow"></scramble-text-label>
    <h1>anyone home?</h1>
    <scramble-text-label :text="`MODESTY`" color="yellow"></scramble-text-label>
  </div>
</template>

<script setup lang="ts">
import ScrambleTextLabel from "./ScrambleTextLabel.vue";
</script>
