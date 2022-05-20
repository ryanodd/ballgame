
import { MyGame } from '../Game/GameService/netplayjs/myGame';
import { SingleClientGame } from '../Game/GameService/SingleClientGame';
import { Action, SET_TEAM_DATA_PAYLOAD, SET_TEAM_DATA, SET_NETPLAY_DATA, SET_UI_DATA, SET_CURRENT_GAME} from './actions'

export type AppState = {
  currentGame: MyGame | SingleClientGame | null
  netplay: {
    isHost: boolean;
    connectingToServer: boolean;
    connectedToPeer: boolean;
    joinUrl: string | null;
    errorMessage: string | null;
    ping: string | null;
    pingStdDev: string | null;
    historyLength: number | null;
    frame: number | null;
    largestFutureSize: number | null;
    predictedFrames: number | null;
    stalling: boolean;
  };
  teams: {
    score: number;
  }[]
  ui: {
    isMainDrawerOpen: boolean;
  }
}

export const initialState: AppState = {
  currentGame: null,
  netplay: {
    isHost: false,
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
  teams: [],
  ui: {
    isMainDrawerOpen: false,
  }
}

// Use the initialState as a default value
export default function appReducer(state = initialState, action: Action): AppState {
  switch (action.type) {
    case SET_CURRENT_GAME: {
      return { ...state, currentGame: action.payload }
    }
    case SET_NETPLAY_DATA: {
      return { ...state, netplay: { ...state.netplay, ...action.payload } }
    }
    case SET_TEAM_DATA: {
      const { teamIndex, teamData } = action.payload as SET_TEAM_DATA_PAYLOAD
      const newTeams = [...state.teams]
      newTeams[teamIndex] = { ...state.teams[teamIndex], ...teamData }
      return { ...state, teams: newTeams }
    }
    case SET_UI_DATA: {
      return { ...state, ui: { ...state.ui, ...action.payload } }
    }
    default:
      return state
  }
}
