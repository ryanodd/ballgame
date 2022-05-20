
export type Action = {
  type: string;
  payload: any;
}

export const SET_NETPLAY_DATA = 'setNetplayData'
export const SET_TEAM_DATA = 'setTeamData'
export type SET_TEAM_DATA_PAYLOAD = {
  teamIndex: number;
  teamData: any; // object? but nah?
}
