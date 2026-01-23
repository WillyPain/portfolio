<template>
  <div class="flex space-x-2">
    <span class="w-80 truncate">{{ fileName }}</span>
    <span class="w-25 text-green-500 text-right">{{ convertedTotal }}</span>
    <pre><span class="text-green-500">{{ progressBar }}</span></pre>
    <span class="w-5 text-right">{{ progress }}%</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  fileName: string;
  total: number;
  loaded: number;
}>();

const barSize = 40;
const progressBar = computed(() => {
  const count = Math.floor((barSize * props.loaded) / props.total);

  return "▓".repeat(count) + "░".repeat(barSize - count);
});

const convertedTotal = computed(() => {
  let t = props.total;
  let unit = "b";
  if (t > 1024) {
    t /= 1024;
    unit = "Kb";
  }
  if (t > 1024) {
    t /= 1024;
    unit = "Mb";
  }
  if (t > 1024) {
    t /= 1024;
    unit = "Gb";
  }

  return `${Math.floor(10 * t) / 10}${unit}`;
});

const progress = computed(() => {
  if (props.total === 0) return 0;
  return Math.floor((100 * props.loaded) / props.total);
});
</script>

<style scoped>
div,
pre,
p {
  font-family: DOSVreJP12;
  line-height: 1.5rem;
}
</style>
