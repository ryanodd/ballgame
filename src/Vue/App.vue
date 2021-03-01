<template>
  <div id="app">
    <aspect-ratio-letterbox/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GameService from "@/Game/GameService/GameService";
import AspectRatioLetterbox from "./components/AspectRatioLetterbox.vue";

let game: GameService;

export default Vue.extend({
  name: "App",
  components: { AspectRatioLetterbox },
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

#testbed {
  // This is literally just so I can use the color picker in VS Code while working in js
  color: rgb(16, 121, 89);
}
</style>
