

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

// This class is meant to be the first class in common between single-client and multi-client games.
// - In single-client, SingleClientGame is in charge of its own Session.
// - In multi-client, each client's MyGame is charge of a Session.
export interface SessionProps {
  players: Player[]
}

export class Session {
  frame = 1

  teams: Team[]
  scene: Scene;
  // If 'Character's ever need to persist state across scene resets, lift them to this class
  players: Player[] // copy of parent. They share a reference. Don't reassign the array itself

  constructor(props: SessionProps){
    this.teams = [
      new Team({
        teamIndex: 0,
      }),
      new Team({
        teamIndex: 1,
      }),
    ]
    this.scene = createScene1({ teams: this.teams, players: props.players, session: this });
    this.players = props.players
  }

  serialize(): JSONObject {
    return {
      frame: this.frame,
      scene: this.scene.serialize(),
      //worldSnapshot: this.scene.world.takeSnapshot().toString(),
      teams: this.teams.map(team => team.serialize()),
      // Todo serialize game objects in scene, they'll probably contain data that needs to be synced at some point
    };
  }

  deserialize(value: JSONObject): void {
    this.frame = value['frame']
    this.scene.deserialize(value['scene']),

    this.teams.forEach((team, i) => {
      team.deserialize(value['teams'][i])
    })
  }

  tick(frame: number) {
    this.frame = frame
    this.tickWorld();
    // this.scene.world.colliders.forEachCollider((collider) => {
    //   console.log(`x: ${collider.translation().x}, y: ${collider.translation().y}, hw: ${collider.halfExtents().x}, hh: ${collider.halfExtents().y}`)
    // })
  }

  // Physics tick
  tickWorld() {
    const eventQueue = new EventQueue(true);
    this.scene.world.step(eventQueue);
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      this.scene.handleCollision(handle1, handle2, started)
    })
  }

  resetScene() {
    this.scene = createScene1({ teams: this.teams, players: this.players, session: this })
  }

  render(c: CanvasRenderingContext2D) {
    this.scene.render(c, this.frame)
  }
}
