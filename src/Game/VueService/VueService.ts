import Vue from "vue";

export interface VueServiceConfig {
  placeholderSetting: string;
} 

export interface VueServicePlayer {
  index: number;
  resourceMeter: number;
}

export interface VueServiceState {
  netplay: {
    connectingToServer: boolean;
    connectedToPeer: boolean;
    joinUrl: string | null;
    errorMessage: string;
    ping: string | null;
    pingStdDev: string | null;
    historyLength: number | null;
    frame: number | null;
    largestFutureSize: number | null;
    predictedFrames: number | null;
    stalling: boolean;
  };
  playerDict: Record<number, VueServicePlayer>;
  game: {
    team1Score: number;
    team2Score: number;
  }
} 

// Information interface between the game (TS) and the UI elements (Vue) 
export class VueServiceImplementation {
  state: VueServiceState; 
  constructor(config: VueServiceConfig){
    this.state = {
      netplay: {
        connectingToServer: false,
        connectedToPeer: false,
        joinUrl: null,
        errorMessage: null,
        ping: null,
        pingStdDev: null,
        historyLength: null,
        frame: null,
        largestFutureSize: null,
        predictedFrames: null,
        stalling: false
      },
      playerDict: {},
      game: {
        team1Score: 0,
        team2Score: 0,
      },
    };
  }

  // SET BY GAME
  ////////////////
  // addPlayer(playerState: VueServicePlayer){
  //   Vue.set(this.state.playerDict, playerState.index, playerState);
  // }

  // setPlayerResourceMeter(playerIndex: number, value: number){
  //   Vue.set(this.state.playerDict[playerIndex], 'resourceMeter', value);
  // }

  setNetplayConnectingToServer(value: boolean){
    Vue.set(this.state.netplay, 'connectingToServer', value);
  }
  setNetplayConnectedToPeer(value: boolean){
    Vue.set(this.state.netplay, 'connectedToPeer', value);
  }
  setNetplayErrorMessage(value: any){
    Vue.set(this.state.netplay, 'errorMessage', value);
  }
  setNetplayJoinUrl(value: any){
    Vue.set(this.state.netplay, 'joinUrl', value);
  }
  setNetplayPing(value: string) {
    Vue.set(this.state.netplay, 'ping', value);
  }
  setNetplayPingStdDev(value: string) {
    Vue.set(this.state.netplay, 'pingStdDev', value);
  }
  setNetplayHistoryLength(value: number) {
    Vue.set(this.state.netplay, 'historyLength', value);
  }
  setNetplayFrame(value: number) {
    Vue.set(this.state.netplay, 'frame', value);
  }
  setNetplayLargestFutureSize(value: number) {
    Vue.set(this.state.netplay, 'futureSize', value);
  }
  setNetplayPredictedFrames(value: number) {
    Vue.set(this.state.netplay, 'predictedFrames', value);
  }
  setNetplayStalling(value: boolean) {
    Vue.set(this.state.netplay, 'stalling', value);
  }

  setTeam1Score(value: number) {
    Vue.set(this.state.game, 'team1Score', value)
  }
  setTeam2Score(value: number) {
    Vue.set(this.state.game, 'team2Score', value)
  }
}

export const VueService = new VueServiceImplementation({placeholderSetting: "uh ok"})
