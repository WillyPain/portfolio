<template>
  <div
    id="fadein"
    class="w-full h-full bg-[#000000] z-50 fixed top-0 left-0 pointer-events-none"
  ></div>
  <div
    id="container"
    class="w-full h-full text-gray-400 text-2xl parent pt-7 px-40"
  >
    <!-- TODO: chuck in loading bar here -->
    <div class="flex flex-col div1">
      <div class="flex flex-row">
        <img :src="susineSoftwareLogo" />
        <div>
          <p>Will's World BIOS v0.1, Perth WA</p>
          <p>
            <span id="t1"></span>
            <span id="cursor1">_</span>
          </p>
        </div>
      </div>
      <br />
      <div id="t2">
        <pre class="truncate w-[50%]">{{ info?.userAgent }}</pre>
        <br />

        <div>
          <pre>Vendor : {{ info?.vendor }}</pre>
          <pre>Language : {{ info?.language }}</pre>
          <pre>OS : {{ info?.platform }} <span id="cursor2">_</span></pre>
        </div>
      </div>
      <br />
    </div>
    <div class="div3">
      <img
        ref="splash"
        :src="susineSoftwareSplash"
        class="h-[60%] w-[60%] opacity-85"
      />
    </div>
    <div class="div2">
      <div id="t3">
        <!-- <p>Downloading system files:</p> -->
        <loading-bar
          v-for="file in files"
          :key="file.filename"
          :file-name="file.filename.split('/').pop() ?? file.filename"
          :loaded="file.loaded"
          :total="file.total"
          class="pb-1.5"
        ></loading-bar>
      </div>
    </div>
    <div class="div4">
      <p>Press <span class="text-white">DEL</span> to enter SETUP</p>
      <p>{{ new Date() }}</p>
    </div>
  </div>
  <div
    id="enter"
    class="w-full h-full text-gray-400 text-2xl items-center justify-center hidden"
  >
    <div @click="start()">
      <pre>╔════════════════════════════════════╗</pre>
      <pre>║                                    ║</pre>
      <pre>║                                    ║</pre>
      <pre>║            Press Enter<span id="cursor3">_</span>            ║</pre>
      <pre>║                                    ║</pre>
      <pre>║                                    ║</pre>
      <pre>╚════════════════════════════════════╝</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingBar from "./LoadingBar.vue";
import ScrambleTextLabel from "./ScrambleTextLabel.vue";
import susineSoftwareSplash from "@/assets/Images/susine_splash.png?url";
import susineSoftwareLogo from "@/assets/Images/mini logo.png";
import { onMounted, ref, watch } from "vue";
import { gsap } from "gsap/gsap-core";
import { TextPlugin } from "gsap/all";
import { RoughEase } from "gsap/all";
import { ResourceLoader } from "@/util/ResourceLoader";
const props = defineProps<{
  loaded: boolean;
}>();

interface FileInfo {
  filename: string;
  loaded: number;
  total: number;
}

const info = ref<Navigator>();

const files = ref<FileInfo[]>([]);
ResourceLoader.Instance.progressEventListeners.push((id, loaded, total) => {
  const file = files.value.find((f) => f.filename == id);
  if (file) {
    file.loaded = loaded;
    file.total = total;
  } else {
    files.value.push({ filename: id, loaded: loaded, total: total });
  }
});

const emitStart = defineEmits<{
  (e: "start", start: boolean): void;
}>();

function start() {
  emitStart("start", true);
}

gsap.registerEffect({
  name: "fade",
  effect: (targets: gsap.TweenTarget, config: gsap.TweenVars) => {
    return gsap.to(targets, { duration: config.duration, opacity: 0 });
  },
  defaults: { duration: 1 }, //defaults get applied to any "config" object passed to the effect
  extendTimeline: true, //now you can call the effect directly on any GSAP timeline to have the result immediately inserted in the position you define (default is sequenced at the end)
});
gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(RoughEase);
const splash = ref(null);
onMounted(() => {
  info.value = navigator;
  splash.value.addEventListener("load", () => {
    gsap.effects.fade("#fadein");

    const tl = gsap.timeline();

    tl.to("#t1", {
      text: "Copywrite (C) 1996-2025, Susine Software, Inc ",
      duration: 0.5,
      ease: "steps(10)",
      onComplete: function () {
        blinkCursor("cursor1");
      },
    });
    tl.from("#t2", {
      text: "",
      duration: 0.5,
      ease: "steps(2)",
      onComplete: function () {
        blinkCursor("cursor2");
      },
    });

    watch(
      () => props.loaded,
      (newVal) => {
        if (newVal) {
          const tl = gsap.timeline();
          tl.to("#container", {
            display: "none",
            onComplete: function () {
              document.getElementById("#container")?.remove();
            },
          });
          tl.to("#enter", {
            display: "flex",
            duration: 0.5,
            delay: 1,
            ease: "steps(30)",
            onComplete: function () {
              blinkCursor("cursor3");
              window.addEventListener("keydown", (e) => {
                if (e.code === "Enter" || e.code === "NumpadEnter") {
                  start();
                }
              });
            },
          });
        }
      }
    );
  });

  let cursorTween: gsap.core.Tween;
  let lastCursorId: string;
  function blinkCursor(cursorId: string) {
    if (lastCursorId) {
      const lastCursor = document.getElementById(lastCursorId);
      lastCursor!.hidden = true;
    }
    cursorTween?.kill();
    const cursor = document.querySelector(`#${cursorId}`);
    cursorTween = gsap.to(cursor, {
      visibility: "hidden",
      repeat: -1,
      yoyo: true,
      ease: "step(1)",
      repeatDelay: 0.2,
      duration: 0.1,
    });
    lastCursorId = cursorId;
  }
});
</script>

<style scoped>
div,
pre {
  font-family: DOSVreJP12;
  line-height: 1.5rem;
}
img {
  image-rendering: pixelated;
}
#container {
  background: #000000;
}

.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(6, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.div1 {
  grid-area: 1 / 1 / 3 / 3;
}
.div2 {
  grid-area: 3 / 1 / 5 / 4;
}
.div3 {
  grid-area: 1 / 3 / 3 / 4;
}
.div4 {
  grid-area: 6 / 1 / 7 / 4;
}
</style>
