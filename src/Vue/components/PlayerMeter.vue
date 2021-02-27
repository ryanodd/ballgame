<template>
  <div class="player-meter-wrapper">
    <div class="player-meter">
      <div class="meter-bg">
        <div class="meter-fg">
        </div>
      </div>  
    </div> 
    <div class="amount-text"> {{50}} </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PlayerMeter"
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
  width: 100px; //programatially?
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
