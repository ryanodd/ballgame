
export type Action = {
  type: string;
  payload: any;
}


export const SET_CURRENT_GAME = 'setgameClass'
export const SET_NETPLAY_DATA = 'setNetplayData'
export const SET_GAME_DATA = 'setGameDatas'
export const SET_TEAM_DATA = 'setTeamData'
export type SET_TEAM_DATA_PAYLOAD = {
  teamIndex: number;
  teamData: any; // object? but nah?
}

export const SET_CHARACTER_DATA = 'setCharacterData'
export type SET_CHARACTER_DATA_PAYLOAD = {
  playerIndex: number;
  characterData: any; // object? but nah?
}

export const SET_UI_DATA = 'setUiData'

export const CLIENT_SWITCH_CHARACTERS = 'clientSwitchCharacters'

export const CLEAR_CLIENT_EVENTS = 'clearClientEvents'
