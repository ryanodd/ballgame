
import { MyGame } from '../Game/GameService/netplayjs/myGame';
import { CharacterType } from '../Game/GameService/Player/CharacterType';
import { SingleClientGame } from '../Game/GameService/SingleClientGame';
import { InputConfig } from '../Game/InputService/model/InputConfig';
import { Action, SET_TEAM_DATA_PAYLOAD, SET_TEAM_DATA, SET_NETPLAY_DATA, SET_UI_DATA, SET_CURRENT_GAME, SET_GAME_DATA, SET_CHARACTER_DATA, SET_CHARACTER_DATA_PAYLOAD, CLEAR_CLIENT_EVENTS, CLIENT_SWITCH_CHARACTERS} from './actions'

export enum ClientEventType {
  SWITCH_CHARACTER = 'SWITCH_CHARACTER'
}

export type SwitchCharacterEvent = {
  eventType: ClientEventType
  playerIndex: number
  characterType: CharacterType
}

export type ClientEvent = SwitchCharacterEvent

export type AppState = {
  gameClass: MyGame | SingleClientGame | null
  clientEvents: ClientEvent[]
  netplay: {
    isHost: boolean;
    connectingToServer: boolean;
    connectedToPeer: boolean;
    joinUrl: string | null;
    errorMessage: string | null;
    ping: string | null;
    pingStdDev: string | null;
    historyLength: number | null;
    largestFutureSize: number | null;
    predictedFrames: number | null;
    stalling: boolean;
  };
  game: {
    framesRemaining: number;
    countdownFrames: number;
    postGoalFrames: number;
    scoringTeamIndex: number | null;
    overtime: boolean;
    characters: {
      characterType: CharacterType;
      resourceMeter: number;
      playerIndex: number;
      netplayPlayerIndex: number;
      teamIndex: number;
      gamepadIndex: number;
      inputConfig: InputConfig;
      mostRecentFailedAbilityFrame: number;
    }[]
    teams: {
      score: number;
      color: string;
    }[]
  }
  ui: {
    isMainMenuOpen: boolean;
    isGameEndOpen: boolean;
    characterSelectPopoverOpenPlayerIndex: number | null;
  }
}

export const initialState: AppState = {
  gameClass: null,
  clientEvents: [],
  netplay: {
    isHost: false,
    connectingToServer: false,
    connectedToPeer: false,
    joinUrl: null,
    errorMessage: null,
    ping: null,
    pingStdDev: null,
    historyLength: null,
    largestFutureSize: null,
    predictedFrames: null,
    stalling: false,
  },
  game: {
    framesRemaining: -1,
    countdownFrames: -1,
    postGoalFrames: -1,
    scoringTeamIndex: null,
    overtime: false,
    characters: [],
    teams: [],
  },
  ui: {
    isMainMenuOpen: false,
    isGameEndOpen: false,
    characterSelectPopoverOpenPlayerIndex: null,
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
    case CLIENT_SWITCH_CHARACTERS: {
      const newClientEvent: ClientEvent = {
        eventType: ClientEventType.SWITCH_CHARACTER,
        playerIndex: action.payload.playerIndex,
        characterType: action.payload.characterType,
      }
      return { ...state, clientEvents: [ ...state.clientEvents, newClientEvent]}
    }
    case CLEAR_CLIENT_EVENTS: {
      return { ...state, clientEvents: []}
    }
    default:
      return state
  }
}
