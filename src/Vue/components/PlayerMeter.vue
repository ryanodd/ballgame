<template>
  <div class="player-meter-wrapper">
    <div class="player-meter">
      <div class="meter-bg">
        <div class="meter-fg" :style="injectBarWidthStyle()">
        </div>
      </div>  
    </div> 
    <div class="amount-text"> {{displayNumber}} </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { VueService } from "@/Game/VueService/VueService.ts"

export default Vue.extend({
  name: "PlayerMeter",
  props: {
    playerIndex: Number
  },
  data: function() {
    return {
      vueService: VueService
    }
  },
  computed: {
    player() {
      return this.vueService.state.playerDict[this.playerIndex]
    },
    displayNumber() {
      return Math.min(100, Math.floor(this.player.resourceMeter))
    }
  },
  methods: {
    injectBarWidthStyle() {
      return {
        'width': this.displayNumber + '%'
      }
    }
  }
});
</script>

<style scoped lang="scss">
.player-meter-wrapper {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
}
.player-meter {
  width: 100%;
}
.meter-bg {
  width: 200px;
  height: 16px;
  
  border-radius: 5px;

  background: linear-gradient(to top right,rgb(158, 158, 158), rgb(170, 170, 170));
}
.meter-fg{
  // width injected from js
  height: 16px;
  
  border-radius: 5px;

  background: linear-gradient(to top right,rgb(46, 224, 40), rgb(49, 245, 59));
}
.amount-text{
  margin-top: 5px;
  margin-bottom: -5px; // font tax

  color: white;
  font-size: 32px;
  font-weight: 600;
}
</style>
