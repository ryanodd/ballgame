<template>
  <div class="canvas-overlay">
    <hud-section class="hud-section-from-parent" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HudSection from "./HudSection.vue";

export default Vue.extend({
  name: "CanvasOverlay",
  components: { HudSection }
});
</script>

<style scoped lang="scss">
.canvas-overlay {
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: min-content 1fr;
}
.hud-section-from-parent{
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}
</style>
