// <template>
//   <div class="score-wrapper">
//     <card-box>
//       <h2 class="score-text">
//         {{scoreValue}}
//       </h2>
//     </card-box>
//   </div>
// </template>

// <script lang="ts">
// import { VueService } from "@/Game/VueService/VueService";
// import Vue from "vue";
// import CardBox from "./CardBox.vue";

// export default Vue.extend({
//   components: { CardBox },
//   name: "ScoreBox",
//   data: function() {
//     return {
//       vueService: VueService
//     }
//   },
//   computed: {
//     scoreValue() {
//       return `${this.vueService.state.game.team1Score} - ${this.vueService.state.game.team2Score}`
//     }
//   }
// });
// </script>

// <style scoped lang="scss">
// .score-wrapper {
//   position: absolute;
//   top: 5px;
//   left: 50%;
//   transform: translateX(-50%);
// }
// .score-text {
//   margin: 0;
// }
// </style>
