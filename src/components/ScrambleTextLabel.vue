<template>
  <div class="scramble">{{ props.text }}</div>
</template>

<script setup lang="ts">
import { genericGlitchCharacters, letterToSpecialChars } from "@/definitions";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { onMounted } from "vue";

// Props: shader uniforms object
const props = defineProps<{
  text: string;
  color: string;
}>();

const colorProp = props.color;

onMounted(() => {
  // I dont like that I need this timeout.
  // Will need to find a better time to split the text
  setTimeout(() => {
    const split = SplitText.create(".scramble", {
      type: "chars",
      charsClassClass: "char",
    });
    split.chars.forEach((c) => {
      const character = c.textContent;
      const scrambleEffect = () => {
        const glitch = letterToSpecialChars.get(
          character?.toUpperCase() ?? "A"
        );
        if (!glitch) return;
        const r = Math.floor(Math.random() * glitch.length) % glitch.length;
        const randomLetter = glitch[r];
        if (!gsap.isTweening(c)) {
          gsap.to(c, {
            overwrite: true,
            scrambleText: {
              text: randomLetter ?? "A",
              speed: 1.5,
              revealDelay: 0.3,
              chars: genericGlitchCharacters.join(""),
              oldClass: "corrupt",
            },
            onComplete: () => {
              setTimeout(() => {
                c.textContent = character;
              }, 200);
            },
          });
        }
      };
      c.addEventListener("mouseenter", scrambleEffect);
    });
  }, 100);
});
</script>

<style>
.scramble {
  font-family: "VT323 Regular", monospace;
  font-style: normal;
  font-weight: 400;
  font-size: 2rem;
  background-color: black;
  color: v-bind("colorProp");
}
.corrupt {
  font-family: "VT323 Regular", monospace;
  font-weight: 400;
  font-size: 2rem;
  /* padding: 0.45rem 0.01rem; */
  color: #0240ff;
  background-color: white;
  /* text-shadow:
    1px 0 red,
    -1px 0 cyan,
    2px 1px #00ff7f;
  animation: glitch-shadow 0.3s infinite alternate; */
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
