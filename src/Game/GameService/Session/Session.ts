

// Everything that exists identically for all clients

import GameObject from "../GameObject/GameObject";
import { Team } from "../Team/Team";
import { Scene } from "../Scene/Scene";
import { PulseCharacter } from "../Player/PlayerTypes/PulseCharacter";
import { createScene1 } from "../Scene/SceneFactory/Scene1";
import { EventQueue, World } from "@dimforge/rapier2d";
import { MyInput } from "../netplayjs/MyInput";
import { Player } from "../Player/Player";
import { JSONValue } from "../../../lib/netplayjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SessionProps {
  players: Player[]
}

export class Session {
  teams: Team[]
  scene: Scene;

  constructor(props: SessionProps){
    this.teams = [
      new Team({
        teamIndex: 0,
        characters: [
          new PulseCharacter({ // todo: probably just CHOOSE these here and construct them in createScene
            player: props.players[0],
            RADIUS: 0.240,
            DENSITY: 0.5,
            FRICTION: 0.5,
            RESTITUTION: 0.0
          })
        ],
      }),
      new Team({
        teamIndex: 1,
        characters: [
          new PulseCharacter({
            player: props.players[1],
            RADIUS: 0.240,
            DENSITY: 0.5,
            FRICTION: 0.5,
            RESTITUTION: 0.0
          })
        ]
      }),
    ]
    this.scene = createScene1({ teams: this.teams, session: this });
  }

  serialize(): JSONValue {
    return {
      worldSnapshot: this.scene.world.takeSnapshot().toString(),
      teams: this.teams.map(team => team.serialize()),
      // Todo serialize game objects in scene, they'll probably contain data that needs to be synced at some point
    };
  }

  deserialize(value: JSONValue): void {
    const worldSnapshot = value['worldSnapshot']
    const splitSnapshot = worldSnapshot.split(',')
    const array = new Uint8Array(splitSnapshot)
    this.scene.world = World.restoreSnapshot(array);

    this.teams.forEach((team, i) => {
      team.deserialize(value['teams'][i])
    })
  }

  tick() {
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
    this.scene = createScene1({ teams: this.teams, session: this })
  }
}
