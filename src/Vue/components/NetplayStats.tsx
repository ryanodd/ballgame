export {}

// <template>
//   <div class="netplay-stats-wrapper">
//     <card-box>
//       <table class="netplay-stats-table">
//         <span v-if="!!this.vueService.state.netplay.errorMessage">
//           {{this.vueService.state.netplay.errorMessage}}
//         </span>
//         <tr>
//           <td>Ping</td>
//           <td>{{this.ping}}</td>
//         </tr>
//         <tr>
//           <td>History Length</td>
//           <td>{{this.vueService.state.netplay.historyLength}}</td>
//         </tr>
//         <tr>
//           <td>Frame</td>
//           <td>{{this.vueService.state.netplay.frame}}</td>
//         </tr>
//         <tr>
//           <td>Largest Future Size</td>
//           <td>{{this.vueService.state.netplay.largestFutureSize}}</td>
//         </tr>
//         <tr>
//           <td>Predicted Frames</td>
//           <td>{{this.vueService.state.netplay.predictedFrames}}</td>
//         </tr>
//         <tr>
//           <td>Stalling</td>
//           <td>{{this.vueService.state.netplay.stalling}}</td>
//         </tr>
//       </table>
//     </card-box>
//   </div>
// </template>

// <script lang="ts">
// import { VueService } from "@/Game/VueService/VueService";
// import Vue from "vue";
// import CardBox from "./CardBox.vue";

// export default Vue.extend({
//   components: { CardBox },
//   name: "NetplayStats",
//   data: function() {
//     return {
//       vueService: VueService
//     }
//   },
//   computed: {
//     ping() {
//       const ping = this.vueService.state.netplay.ping
//       if (ping !== null) {
//         return `${ping}ms +/- ${this.vueService.state.netplay.pingStdDev}ms`
//       }
//       return null
//     }
//   }
// });
// </script>

// <style scoped lang="scss">
// .netplay-stats-wrapper {
//   position: absolute;
//   bottom: 5px;
//   right: 5px;
// }
// .netplay-stats-table {
//   //table-layout: fixed;
//   width: 300px;
// }
// </style>
