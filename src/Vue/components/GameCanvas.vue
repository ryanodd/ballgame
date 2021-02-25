<template>
  <div class="canvas-wrapper">
    <canvas id="game-canvas" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "GameCanvas"
});
</script>

<style scoped lang="scss">
.canvas-wrapper {
  position: relative;
  $width-px: 1000px;
  width: $width-px;
  height: 0;
  padding-bottom: calc(#{$width-px} * (9/16));
}
#game-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#testbed{
  // This is literally just so I can use the color picker in VS Code while working in js
  color: rgb(126, 226, 151) 
}
</style>
