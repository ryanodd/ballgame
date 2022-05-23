
import { MyGame } from '../Game/GameService/netplayjs/myGame';
import { SingleClientGame } from '../Game/GameService/SingleClientGame';
import { Action, SET_TEAM_DATA_PAYLOAD, SET_TEAM_DATA, SET_NETPLAY_DATA, SET_UI_DATA, SET_CURRENT_GAME, SET_GAME_DATA, SET_CHARACTER_DATA, SET_CHARACTER_DATA_PAYLOAD} from './actions'

export type AppState = {
  gameClass: MyGame | SingleClientGame | null
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
  game: {
    framesRemaining: number | null;
    overtime: boolean;
    characters: {
      resourceMeter: number;
      playerIndex: number;
      teamIndex: number;
    }[]
    teams: {
      score: number;
      color: string;
    }[]
  }
  ui: {
    isMainMenuOpen: boolean;
    isGameEndOpen: boolean;
  }
}

export const initialState: AppState = {
  gameClass: null,
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
  game: {
    framesRemaining: null,
    overtime: false,
    characters: [],
    teams: [],
  },
  ui: {
    isMainMenuOpen: false,
    isGameEndOpen: false,
  }
}

// Use the initialState as a default value
export default function appReducer(state = initialState, action: Action): AppState {
  switch (action.type) {
    case SET_CURRENT_GAME: {
      return { ...state, gameClass: action.payload }
    }
    case SET_NETPLAY_DATA: {
      return { ...state, netplay: { ...state.netplay, ...action.payload } }
    }
    case SET_GAME_DATA: {
      return { ...state, game: { ...state.game, ...action.payload }}
    }
    case SET_TEAM_DATA: {
      const { teamIndex, teamData } = action.payload as SET_TEAM_DATA_PAYLOAD
      const newTeams = [...state.game.teams]
      newTeams[teamIndex] = { ...state.game.teams[teamIndex], ...teamData }
      return { ...state, game: {...state.game, teams: newTeams } }
    }
    case SET_CHARACTER_DATA: {
      const { playerIndex, characterData } = action.payload as SET_CHARACTER_DATA_PAYLOAD
      const newCharacters = [...state.game.characters]
      newCharacters[playerIndex] = { ...state.game.characters[playerIndex], ...characterData }
      return { ...state, game: {...state.game, characters: newCharacters } }
    }
    case SET_UI_DATA: {
      return { ...state, ui: { ...state.ui, ...action.payload } }
    }
    default:
      return state
  }
}
