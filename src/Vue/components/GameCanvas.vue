<template>
  <div class="canvas-wrapper">
    <canvas-overlay class="canvas-overlay-from-parent"/>
    <canvas id="game-canvas" v-once/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CanvasOverlay from "./CanvasOverlay.vue";

export default Vue.extend({
  name: "GameCanvas",
  components: { CanvasOverlay }
});
</script>

<style scoped lang="scss">
.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgb(42, 43, 49)
}
#game-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.canvas-overlay-from-parent{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
</style>
