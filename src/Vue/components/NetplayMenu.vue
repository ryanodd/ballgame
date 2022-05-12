<template>
  <div class="netplay-menu-wrapper">
    <card>
      <a :href="this.vueService.state.netplay.joinUrl" target="_blank">
        Open Player 2 Tab
      </a>
    </card>
  </div>
</template>

<script lang="ts">
import { VueService } from "@/Game/VueService/VueService";
import Vue from "vue";
import Card from "./Card.vue";

export default Vue.extend({
  components: { Card },
  name: "NetplayMenu",
  data: function() {
    return {
      vueService: VueService
    }
  },
  computed: {
    displayNumber() {
      console.log(this.vueService.state.netplay)
      return 'some value'
    }
  },
});
</script>

<style scoped lang="scss">
.netplay-menu-wrapper {
  position: absolute;
  bottom: 5px;
  left: 5px;
}
</style>
