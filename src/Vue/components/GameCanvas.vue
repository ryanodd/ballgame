<template>
  <div class="canvas-wrapper">
    <canvas-overlay class="canvas-overlay-from-parent"/>
    <canvas id="game-canvas" />
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
  $width-px: 1600px;
  width: $width-px;
  height: 0;
  padding-bottom: calc(#{$width-px} * (9 / 16));
  background-color: rgb(42, 43, 49)
}
#game-canvas {
  position: absolute;
  width: 100%;
  bottom: 0;
}
.canvas-overlay-from-parent{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

#testbed {
  // This is literally just so I can use the color picker in VS Code while working in js
  color: rgb(126, 226, 151);
}
</style>
