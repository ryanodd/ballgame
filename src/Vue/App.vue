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
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

#app {
  font-family: 'Roboto', Helvetica, Avenir, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top right,rgb(20, 20, 20), rgb(29, 29, 29));
}
</style>
