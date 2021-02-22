<template>
  <div id="app">
    <game-canvas />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GameCanvas from "./components/GameCanvas.vue";
import GameController from "@/GameController";

export default Vue.extend({
  name: "App",
  components: { GameCanvas }
});

const game = new GameController();
</script>

<style lang="scss">
#app {
  font-family: Helvetica, Avenir, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width: 100vw;
  height: 100vh;
}
</style>
