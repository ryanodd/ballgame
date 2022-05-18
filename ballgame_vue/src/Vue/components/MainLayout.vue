<template>
  <div class="main-layout">
    <aspect-ratio-letterbox>
      <game-canvas />
    </aspect-ratio-letterbox>
    <score-box />
    <netplay-menu v-if="this.shouldShowNetplayMenu" />
    <netplay-stats v-if="this.shouldShowNetplayStats" />
  </div>
</template>

<script lang="ts">
import { VueService, VueServiceImplementation } from "@/Game/VueService/VueService";
import Vue from "vue";
import AspectRatioLetterbox from "./AspectRatioLetterbox.vue";
import GameCanvas from "./GameCanvas.vue";
import NetplayMenu from "./NetplayMenu.vue";
import NetplayStats from "./NetplayStats.vue";
import * as query from "query-string";
import ScoreBox from "./ScoreBox.vue";

export default Vue.extend({
  components: { AspectRatioLetterbox, NetplayMenu, NetplayStats, GameCanvas, ScoreBox },
  name: "MainLayout",
  data: function() {
    return {
      vueService: VueService as VueServiceImplementation
    }
  },
  computed: {
    shouldShowNetplayMenu() {
      // Quick & dirty hack to see whether we're the host tab
      const parsedHash = query.parse(window.location.hash);
      const isHost = !parsedHash.room;

      return this.vueService.state.netplay.joinUrl !== null && (isHost && !this.vueService.state.netplay.connectedToPeer)
    },
    shouldShowNetplayStats() {
      // I'm guessing these are the only times we'd want to see it
      return this.vueService.state.netplay.connectedToPeer || this.vueService.state.netplay.errorMessage
    }

  },
});
</script>

<style scoped lang="scss">
.main-layout {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
