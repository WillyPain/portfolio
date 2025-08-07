<script setup lang="ts">
import gsap from 'gsap';
import SplitText from 'gsap/SplitText'
import { onMounted } from 'vue'

//TODO: need to find a better way to add multiple canvases when reloading during dev
onMounted(async () => {
  await document.fonts.ready;
  configureSplitText();
});

async function configureSplitText() {
  let split = SplitText.create(".split", {
    type: "chars",
    charsClassClass: "char",
  });

  gsap.from(".split", {
    autoAlpha: 0,
  });

  gsap.from(split.chars, {
    yPercent: "-10",
    autoAlpha: 0,

    stagger: {
      amount: 2,
      repeat: -1,
      yoyo: true,
    },
    duration: 1,
  });
}
</script>

<template>
  <div class="flex flex-col h-full justify-end">
    <p class="split">"Loading . . ."</p>
  </div>
</template>

<style scoped>

:deep(char) {
  outline: 3px dashed;
  outline-color: white;
  border-radius: 10px;
}

.split {
  visibility: hidden;
  color: #FF4032;
  font-size: 4rem;
}

.container {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
