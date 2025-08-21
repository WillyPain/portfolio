<template>
  <div class="scramble">{{ props.text }}</div>
</template>

<script setup lang="ts">
import { genericGlitchCharacters, letterToSpecialChars } from "@/definitions";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    text: string;
    color?: string;
    size?: string;
    bg?: string;
  }>(),
  {
    color: "white",
    size: "2rem",
    bg: "blue",
  }
);

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
      c.addEventListener("css3d", scrambleEffect);
    });
  }, 100);
});
</script>

<style>
.scramble {
  font-family: "VT323 Regular", monospace;
  background-color: v-bind(bg);
  color: v-bind(colorProp);
  font-size: v-bind(size);
}
.corrupt {
  color: #0240ff;
  background-color: white;
}
</style>
