<template>
  <div id="app">
    <game-canvas v-once/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GameCanvas from "./components/GameCanvas.vue";
import GameService from "@/Game/GameService/GameService";

let game: GameService;

export default Vue.extend({
  name: "App",
  components: { GameCanvas },
  mounted() {
    game = new GameService();
  }
});


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
