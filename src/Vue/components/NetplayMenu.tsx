// <template>
//   <div class="netplay-menu-wrapper">
//     <card-box>
//       <div class="netplay-menu-column">
//         <button @click="copyToClipboard">
//           Copy Player 2 Link to Clipboard
//         </button>
//         <a :href="this.vueService.state.netplay.joinUrl" target="_blank">
//           Open Player 2 Tab
//         </a>
//       </div>
//     </card-box>
//   </div>
// </template>

// <script lang="ts">
// import { VueService } from "@/Game/VueService/VueService";
// import Vue from "vue";
// import CardBox from "./CardBox.vue";

// export default Vue.extend({
//   components: { CardBox },
//   name: "NetplayMenu",
//   data: function() {
//     return {
//       vueService: VueService
//     }
//   },
//   computed: {
//     displayNumber() {
//       console.log(this.vueService.state.netplay)
//       return 'some value'
//     }
//   },
//   methods: {
//     copyToClipboard() {
//       window.navigator.clipboard.writeText(this.vueService.state.netplay.joinUrl)
//     }
//   }
// });
// </script>

// <style scoped lang="scss">
// .netplay-menu-wrapper {
//   position: absolute;
//   bottom: 5px;
//   left: 5px;
// }
// .netplay-menu-column {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   :not(:last-child) {
//     margin-bottom: 8px;
//   }
//   padding: 4px;
// }
// </style>
