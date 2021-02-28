<template>
  <div :class="this.shouldUseHorizontalLetterbox ? 'aspect-ratio-wrapper-h' : 'aspect-ratio-wrapper-v'" ref="aspectRatioWrapper">
    <div :class="this.shouldUseHorizontalLetterbox ? 'aspect-ratio-div-h' : 'aspect-ratio-div-v'">
      <div class="content-wrapper">
        <game-canvas />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GameCanvas from "./GameCanvas.vue"

// forces 16:9. Not using consts for 16:9 because css is involved 

export default Vue.extend({
  name: "AspectRatioLetterbox",
  components: { GameCanvas },
  data: function() {
    return {
      shouldUseHorizontalLetterbox: true
    }
  },
	methods: {
		detectWidth() {
			const aspectRatioWrapperElement = this.$refs.aspectRatioWrapper as Element;
      const contentWrapperAspectRatio = aspectRatioWrapperElement.clientWidth / aspectRatioWrapperElement.clientHeight
			this.shouldUseHorizontalLetterbox = contentWrapperAspectRatio >= (16 / 9);
		}
	},
	mounted() {
		this.detectWidth();
		window.onresize = this.detectWidth.bind(this);
	}
});
</script>

<style scoped lang="scss">
.aspect-ratio-wrapper-h,
.aspect-ratio-wrapper-v {
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgb(88, 223, 166);
}

.aspect-ratio-wrapper-h {
  writing-mode: vertical-lr;
}

.aspect-ratio-div-h,
.aspect-ratio-div-v {
  position: relative;
  box-sizing: content-box;
}

.aspect-ratio-div-h {
  $height-percent: 100%;
  height: $height-percent;
  width: 0;
  padding-right: calc(#{$height-percent} * (16 / 9));
}
.aspect-ratio-div-v {
  $width-percent: 100%;
  width: $width-percent;
  height: 0;
  padding-bottom: calc(#{$width-percent} * (9 / 16));
}

.content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  writing-mode: horizontal-tb;
}
</style>
