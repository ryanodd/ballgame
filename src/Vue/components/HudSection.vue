<template>
  <div class="hud-section">
    <player-meter v-for="player in players" :key="player.index" :playerIndex="player.index"/>
  </div>
</template>

<script lang="ts">
import { VueService } from "@/Game/VueService/VueService";
import Vue from "vue";
import PlayerMeter from "./PlayerMeter.vue"

export default Vue.extend({
  name: "HudSection",
  components: { PlayerMeter },
  data: function() {
    return {
      vueService: VueService,
    }
  },
  computed: {
    players() {
      return Object.values(this.vueService.state.playerDict);
    }
  }
});
</script>

<style scoped lang="scss">
  .hud-section{
    position: relative;

    border-radius: 3px;


    padding: 16px;
    margin: 10px;
    background: linear-gradient(to top right,rgba(175, 175, 175, 0.5), rgba(184, 184, 184, 0.5));
  }
</style>
