

// Everything that exists identically for all clients

import GameObject from "../GameObject/GameObject";
import { Team } from "../Team/Team";
import { Scene } from "../Scene/Scene";
import { PulseCharacter } from "../Player/PlayerTypes/PulseCharacter";
import { createScene1 } from "../Scene/SceneFactory/Scene1";
import { EventQueue, World } from "@dimforge/rapier2d";
import { MyInput } from "../netplayjs/MyInput";
import { Player } from "../Player/Player";
import { JSONObject } from "../../../lib/netplayjs";
import { store } from "../../../../pages/_app";
import { SET_GAME_DATA, SET_UI_DATA } from "../../../redux/actions";

// This class is meant to be the first class in common between single-client and multi-client games.
// - In single-client, SingleClientGame is in charge of its own Session.
// - In multi-client, each client's MyGame is charge of a Session.
export interface SessionProps {
  players: Player[]
}

export class Session {
  frame = 1
  //                        FPS  Sec  Min
  endFrame: number | null = 60 * 60 * 1.5
  ended: boolean = false
  overtime: boolean = false

  teams: Team[]
  scene: Scene;
  // If 'Character's ever need to persist state across scene resets, lift them to this class
  players: Player[] // copy of parent. They share a reference. Don't reassign the array itself

  constructor(props: SessionProps){
    this.teams = [
      new Team({
        teamIndex: 0,
        color: 'rgb(24, 144, 255)'
      }),
      new Team({
        teamIndex: 1,
        color: 'rgb(126, 226, 151)'
      }),
    ]
    this.scene = createScene1({ teams: this.teams, players: props.players, session: this });
    this.players = props.players

    store.dispatch({
      type: SET_GAME_DATA,
      payload: {
        overtime: false,
        framesRemaining: this.endFrame,
      }
    })
  }

  serialize(): JSONObject {
    return {
      frame: this.frame,
      scene: this.scene.serialize(),
      teams: this.teams.map(team => team.serialize()),
    };
  }

  deserialize(value: JSONObject): void {
    this.frame = value['frame']
    this.scene.deserialize(value['scene'])

    // TODO this is a total hack job:
    // don't accept updates to team score
    // for some reason when the game ends, the score gets overwritten by zeroes without this check... firgure it OUT!
    if (!this.ended) {
      this.teams.forEach((team, i) => {
        team.deserialize(value['teams'][i])
      })
    }
  }

  tick(frame: number) {
    if (this.ended) {
      return
    }
    this.frame = frame
    if (this.endFrame !== null) {

      // Send time remaining data to frontend
      store.dispatch({
        type: SET_GAME_DATA,
        payload: {
          framesRemaining: this.endFrame - frame
        }
      })

      // Check for last frame
      if (frame >= this.endFrame){
        if (this.teams[0].score !== this.teams[1].score) {
          this.end()
        } else {
          this.endFrame = null
          this.overtime = true
          store.dispatch({
            type: SET_GAME_DATA,
            payload: {
              framesRemaining: null,
              overtime: true,
            }
          })
        }
        
      }
    }
    this.scene.tick(frame)
  }

  onGoalAgainst(teamIndex: number) {
    const otherTeamIndex = teamIndex === 0 ? 1 : 0
    console.log('on goal against, about to call onGoal')
    this.teams[otherTeamIndex].onGoal();
    if (this.overtime) {
      console.log('overtime you say? calling end()')
      this.end()
    } else {
      this.scene = createScene1({ teams: this.teams, players: this.players, session: this })
    }
  }

  end() {
    this.ended = true
    store.dispatch({
      type: SET_UI_DATA,
      payload: {
        isGameEndOpen: true,
      }
    })
  }

  render(c: CanvasRenderingContext2D) {
    this.scene.render(c, this.frame)
  }
}
