
import { Action, SET_TEAM_DATA_PAYLOAD, SET_TEAM_DATA, SET_NETPLAY_DATA} from './actions'

export type AppState = {
  netplay: {
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
}

export const initialState: AppState = {
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
  teams: [],
}

// Use the initialState as a default value
export default function appReducer(state = initialState, action: Action): AppState {
  switch (action.type) {
    case SET_NETPLAY_DATA: {
      return { ...state, netplay: { ...state.netplay, ...action.payload } }
    }
    case SET_TEAM_DATA: {
      const { teamIndex, teamData } = action.payload as SET_TEAM_DATA_PAYLOAD
      const newTeams = [...state.teams]
      newTeams[teamIndex] = { ...state.teams[teamIndex], ...teamData }
      return { ...state, teams: newTeams }
    }
    default:
      return state
  }
}
