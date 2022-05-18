<template>
  <div class="card">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CardBox",
});
</script>

<style scoped lang="scss">
.card {
  background-color: white;
  opacity: 0.8;
  border-radius: 4px;
  padding: 4px 6px;
}
</style>
