<template>
  <div
    id="monitor"
    class="w-[120vh] h-[100vh] overflow-auto text-emerald-300 relative p-50"
  >
    <div class="scrollTarget"></div>
    <div class="flex gap-0.5 justify-center">
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
      <scramble-text-label
        :text="`MODESTY`"
        color="white"
      ></scramble-text-label>
    </div>
    <div class="flex justify-between mt-10">
      <h1 class="pt-1">The Year is 1996...</h1>
      <img width="256" :src="appleJoeCrunchPfp" />
    </div>

    <h1 class="mt-5">apple + joe = CRUNCH!</h1>
    <div class="flex gap-0.5 justify-center">
      <scramble-text-label
        :text="`CRUNCH FOREVER CRUNCH FOREVER CRUNCH FOREVER CRUNCH FOREVER CRUNCH FOREVER CRUNCH FOREVER CRUNCH FOREVER CRUNCH FOREVER `"
        color="white"
      ></scramble-text-label>
    </div>
    <h2 class="mt-1">D d D d Drink it Drinkt it up!</h2>
    <header>
      <h1 id="title">Apple Audit: Final Report</h1>
      <p class="subtitle">Assessor: Joe “Crunch” // Semester: Autumn</p>
    </header>

    <div class="flex justify-between pr-[5rem]">
      <section class="panel" aria-labelledby="five-words">
        <h2
          id="five-words"
          style="margin: 0 0 10px; font-size: 1.05rem; color: #c9cdd1"
        >
          Five words an apple doesn’t want to hear
        </h2>
        <p class="quote">
          <span class="accent">“Worms live rent-free inside.”</span>
        </p>
      </section>
      <img width="100" :src="appleGif" />
    </div>

    <section class="panel" aria-labelledby="report-card">
      <h2
        id="report-card"
        style="margin: 0 0 10px; font-size: 1.05rem; color: #c9cdd1"
      >
        Final Report Card
      </h2>
      <table role="table" aria-describedby="report-card">
        <thead>
          <tr>
            <th scope="col">Subject</th>
            <th scope="col">Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Crunching</td>
            <td class="grade">A+</td>
          </tr>
          <tr>
            <td>Bruising Resistance</td>
            <td class="grade">C-</td>
          </tr>
          <tr>
            <td>Shine Maintenance</td>
            <td class="grade">B</td>
          </tr>
          <tr>
            <td>Core Stability</td>
            <td class="grade">D</td>
          </tr>
          <tr>
            <td>Temptation of Eve</td>
            <td class="grade">Incomplete</td>
          </tr>
        </tbody>
      </table>
    </section>

    <div class="flex justify-evenly m-[4rem]">
      <img width="250px" height="500px" :src="eyeGif" />
      <img width="250px" height="500px" :src="eyeGif" />
    </div>
    <footer>
      Note: Further study recommended in Core Reinforcement &amp; Temptation
      Ethics. Please avoid worm-related housing schemes.
    </footer>
  </div>
</template>

<script setup lang="ts">
import ScrambleTextLabel from "./ScrambleTextLabel.vue";
import appleJoeCrunchPfp from "@/assets/Images/apple-joe-crunch.png?url";
import appleGif from "@/assets/Images/apple-sparkle.gif?url";
import eyeGif from "@/assets/Images/eye.gif?url";
</script>

<style>
scramble-text-label {
  background: blue;
}

h1 {
  margin-top: 2rem;
}

img {
  border: solid 0.5rem lightseagreen;
}
</style>
