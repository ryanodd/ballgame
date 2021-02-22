<template>
  <canvas id="game-canvas" />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "GameCanvas"
});
</script>

<style scoped lang="scss">
#game-canvas {
  width: 100%;
  height: 100%;
  color: rgb(42, 43, 49);
}
</style>
