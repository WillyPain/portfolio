<template>
  <div class="scramble">{{ props.text }}</div>
</template>

<script setup lang="ts">
import { letterToSpecialChars } from "@/definitions";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { onMounted } from "vue";

// Props: shader uniforms object
const props = defineProps<{
  text: string;
}>();

onMounted(() => {
  const split = SplitText.create(".scramble", {
    type: "chars",
    charsClassClass: "char",
  });

  split.chars.forEach((c) => {
    const character = c.textContent;
    const scrambleEffect = () => {
      if (!gsap.isTweening(c)) {
        gsap.to(c, {
          overwrite: true,
          scrambleText: {
            text: character ?? "A",
            speed: 0.5,
            revealDelay: 0.3,
            chars:
              letterToSpecialChars
                .get(character?.toUpperCase() ?? "A")
                ?.join("") ?? "apple",
            oldClass: "corrupt",
          },
        });
      }
    };

    c.addEventListener("mouseenter", scrambleEffect);
  });
});
</script>

<style>
.scramble {
  font-family: "VT323 Regular", monospace;
  font-style: normal;
  font-weight: 400;
  font-size: 2rem;
  background-color: #0240ff;
}
.corrupt {
  font-family: "Unispace", "arial", monospace;
  font-style: italic;
  font-weight: 400;
  font-size: 1rem;
  color: #0240ff;
  line-height: 1rem;
  background-color: white;
  text-shadow:
    1px 0 red,
    -1px 0 cyan,
    2px 1px #00ff7f;
  animation: glitch-shadow 0.3s infinite alternate;
}

@keyframes glitch-shadow {
  0% {
    text-shadow:
      1px 0 red,
      -1px 0 cyan,
      2px 1px #00ff7f;
  }
  50% {
    text-shadow:
      2px 0 red,
      -2px 0 cyan,
      1px 2px #00ff7f;
  }
  100% {
    text-shadow:
      1px 1px red,
      -1px -1px cyan,
      3px 0 #00ff7f;
  }
}
</style>
