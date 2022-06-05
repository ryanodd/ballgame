

// Everything that exists identically for all clients

import seedrandom from 'seedrandom'
import GameObject from "../GameObject/GameObject";
import { Team } from "../Team/Team";
import { Scene } from "../Scene/Scene";
import { PulseCharacter } from "../Player/PlayerTypes/PulseCharacter";
import { createScene1 } from "../Scene/SceneFactory/Scene1";
import { EventQueue, World } from "@dimforge/rapier2d";
import { MyInput } from "../netplayjs/MyInput";
import { Player } from "../Player/Player";
import { JSONValue } from "../../../lib/netplayjs";
import { store } from "../../../../pages/_app";
import { SET_GAME_DATA, SET_UI_DATA } from "../../../redux/actions";
import { createScene2 } from "../Scene/SceneFactory/Scene2";
import { ClientEvent, ClientEventType } from '../../../redux/reducer';

const COUNTDOWN_FRAMES = 180
const POST_GOAL_FRAMES = 140

// This class is meant to be the first class in common between single-client and multi-client games.
// - In single-client, SingleClientGame is in charge of its own Session.
// - In multi-client, each client's MyGame is charge of a Session.
export interface SessionProps {
  players: Player[]
  sessionSeed: string, 
}

export class Session {
  frame = 0
  //                        FPS  Sec  Min
  framesRemaining: number = 60 * 60 * 1.5
  ended: boolean = false

  countdownFrames: number = COUNTDOWN_FRAMES
  postGoalFrames: number = -1
  scoringTeamIndex: number | null = null
  overtime: boolean = false
  
  readonly sessionSeed: string
  randomSeed: string = '' // randomSeed = sessionSeed + frame #

  teams: Team[]
  scene: Scene;
  // If 'Character's ever need to persist state across scene resets, lift them to this class
  players: Player[] // copy of parent. They share a reference. Don't reassign the array itself

  constructor(props: SessionProps) {
    this.teams = [
      new Team({
        teamIndex: 0,
        color: 'rgb(86, 218, 245)'
      }),
      new Team({
        teamIndex: 1,
        color: 'rgb(126, 226, 151)'
      }),
    ]
    this.scene = createScene2({ teams: this.teams, players: props.players, session: this })
    this.players = props.players
    this.sessionSeed = props.sessionSeed

    store.dispatch({
      type: SET_GAME_DATA,
      payload: {
        overtime: false,
        framesRemaining: this.framesRemaining,
      }
    })
  }

  serialize(): any {
    return {
      frame: this.frame,
      framesRemaining: this.framesRemaining,
      countdownFrames: this.countdownFrames,
      postGoalFrames: this.postGoalFrames,
      scene: this.scene.serialize(),
      teams: this.teams.map(team => team.serialize()),
    };
  }

  deserialize(value: any): void {
    this.frame = value['frame']
    this.framesRemaining = value['framesRemaining']
    this.countdownFrames = value['countdownFrames']
    this.postGoalFrames = value['postGoalFrames']
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

  shouldTickPlayersThisFrame(): boolean {
    return this.countdownFrames === -1
  }

  tick(frame: number) {
    if (this.ended) {
      return
    }
    this.randomSeed = this.sessionSeed + frame.toString()
    this.frame = frame

    // we count down one of three timers: pre-game countdown, post-goal break, and in-game timer
    // the frame timer being -1 signifies it's not active. 0 means it just ended
    if (this.countdownFrames > 0) {
      this.countdownFrames--
      if (this.countdownFrames === 0) {
        this.countdownFrames = -1
      }
    }
    if (this.postGoalFrames > 0) {
      this.postGoalFrames--
      if (this.postGoalFrames === 0) {
        this.postGoalFrames = -1
        if (this.overtime) {
          this.end()
        } else {
          this.scoringTeamIndex = null
          const possibleScenes = [
            createScene1,
            createScene2,
          ]
          this.scene = possibleScenes[Math.floor(seedrandom(this.randomSeed).double() * possibleScenes.length)]({
            teams: this.teams,
            players: this.players,
            session: this,
          })
          this.countdownFrames = COUNTDOWN_FRAMES
        }
      }
    }
    if (this.countdownFrames === -1 && this.postGoalFrames === -1 && this.framesRemaining > 0) {
      this.framesRemaining--
      if (this.framesRemaining === 0) {
        this.framesRemaining = -1
        if (this.teams[0].score !== this.teams[1].score) {
          this.end()
        } else {
          this.overtime = true
          store.dispatch({
            type: SET_GAME_DATA,
            payload: {
              framesRemaining: -1,
              overtime: true,
            }
          })
        }
      }
    }

    // Tick the world regardless
    this.scene.tick(frame)

    // Send time remaining data to frontend
    if (frame % 10 === 0) {
      store.dispatch({
        type: SET_GAME_DATA,
        payload: {
          framesRemaining: this.framesRemaining,
          countdownFrames: this.countdownFrames,
          postGoalFrames: this.postGoalFrames,
        }
      })
    }
  }

  handleClientEvent(event: ClientEvent) {
    if (event.eventType === ClientEventType.SWITCH_CHARACTER) {
      this.players[event.playerIndex].characterType = event.characterType
    }
  }

  onGoalAgainst(teamIndex: number) {
    const otherTeamIndex = teamIndex === 0 ? 1 : 0
    this.teams[otherTeamIndex].onGoal();
    this.scoringTeamIndex = otherTeamIndex
    this.postGoalFrames = POST_GOAL_FRAMES
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
