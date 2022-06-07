import { MyInput, MyInputReader } from './MyInput'

import { assert } from "chai";
import EWMASD from '../../../lib/netplayjs/ewmasd';
import { NetplayPlayer } from '../../../lib/netplayjs';
import { RollbackNetcode } from '../../../lib/netplayjs/netcode/rollback';
import Peer, { DataConnection } from 'peerjs';
import { Store } from 'redux';
import { MyGame } from './myGame';
import { SET_CURRENT_GAME, SET_NETPLAY_DATA, SET_UI_DATA } from '../../../redux/actions';

const PING_INTERVAL = 100;
const INPUT_DELAY_FRAMES = 2;

export class MyRollbackWrapper {

  /** The canvas that the game will be rendered onto. */
  canvas: HTMLCanvasElement;

  inputReader: MyInputReader;

  stateSyncPeriod: number;

  pingMeasure: EWMASD = new EWMASD(0.2); // Ryan: I don't know what this 0.2 does

  // The actual instance of the input serializable game class 
  game?: MyGame;

  rollbackNetcode?: RollbackNetcode<MyGame, MyInput>;

  pingIntervalHandle: ReturnType<typeof setInterval> | null = null// because we need to clear the interval on destruction

  isChannelOrdered(channel: RTCDataChannel) {
    return channel.ordered;
  }

  isChannelReliable(channel: RTCDataChannel) {
    return (
      channel.maxPacketLifeTime === null && channel.maxRetransmits === null
    );
  }

  checkChannel(channel: RTCDataChannel) {
    assert.isTrue(
      this.isChannelOrdered(channel),
      "Data Channel must be ordered."
    );
    assert.isTrue(this.isChannelReliable(channel), "Channel must be reliable.");
  }

  constructor(roomCode: string | null) {
    /**
     * How often should the state be synced. By default this happens
     * every frame. Set to zero to indicate that the state is deterministic
     * and doesn't need to be synced.
     */
    this.stateSyncPeriod = 0;

    // Find canvas for game.
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement

    this.inputReader = new MyInputReader();

    this.roomCode = roomCode
  }

  peer?: Peer;
  readonly roomCode: string | null;

  // Sets up client/host depending on roomCode's existence.
  // Once conneceted, calls startClient/startHost
  start(store: Store) {
    console.info("Creating a PeerJS instance.");
    store.dispatch({ type: SET_NETPLAY_DATA, payload: { connectingToServer: true } })

    this.peer = new Peer({debug: 3}); // "All"
    this.peer.on("error", (err) => {
      store.dispatch({ type: SET_NETPLAY_DATA, payload: { errorMessage: JSON.stringify(err) } })
      console.error(err);
    });

    this.peer!.on("open", (id) => {
      store.dispatch({ type: SET_NETPLAY_DATA, payload: { connectingToServer: false } })

      // If Client
      if (this.roomCode !== null) {
        console.info(`Connecting to room ${this.roomCode}.`);

        const conn = this.peer!.connect(this.roomCode, {
          serialization: "json",
          reliable: true,
          // @ts-ignore: This is a hack written by netplayjs to get around a bug in PeerJS
          _payload: {
            originator: true,
            reliable: true,
          },
        });

        conn.on("error", (err) => {
          store.dispatch({ type: SET_NETPLAY_DATA, payload: { errorMessage: JSON.stringify(err) } })
          console.error(err)
        });

        // Construct the players array.
        const players = [
          new NetplayPlayer(0, false, true), // Player 0 is our peer, the host.
          new NetplayPlayer(1, true, false), // Player 1 is us, a client
        ];

        this.startClient(players, conn, store);
      } else {
        // HOST
        // We are host, so we need to show a join link.
        console.info("Showing join link.");

        // Show the join link.
        const joinURL = `${window.location.href}#room=${id}`;
        store.dispatch({ type: SET_NETPLAY_DATA, payload: { joinUrl: joinURL } })

        // Construct the players array.
        const players = [
          new NetplayPlayer(0, true, true), // Player 0 is us, acting as a host.
          new NetplayPlayer(1, false, false), // Player 1 is our peer, acting as a client.
        ];

        // Wait for a connection from a client.
        this.peer!.on("connection", (conn) => {
          // Make the menu disappear.
          
          conn.on("error", (err) => {
            store.dispatch({ type: SET_NETPLAY_DATA, payload: { errorMessage: JSON.stringify(err) } })
            console.error(err)
          });

          this.startHost(players, conn, id, store);
        });
      }
    });
  }

  getInitialInputs(
    players: Array<NetplayPlayer>
  ): Map<NetplayPlayer, MyInput> {
    const initialInputs: Map<NetplayPlayer, MyInput> = new Map();
    for (const player of players) {
      initialInputs.set(player, new MyInput());
    }
    return initialInputs;
  }

  startHost(players: Array<NetplayPlayer>, conn: DataConnection, hostRoomCode: string, store: Store) {
    console.info("Starting a rollback host.");

    this.game = new MyGame(hostRoomCode, store);
    store.dispatch({ type: SET_CURRENT_GAME, payload: this.game });
    store.dispatch({ type: SET_NETPLAY_DATA, payload: { delayFrames: INPUT_DELAY_FRAMES } })

    this.rollbackNetcode = new RollbackNetcode(
      true,
      this.game!,
      players,
      this.getInitialInputs(players),
      10,
      this.pingMeasure,
      MyGame.timestep,
      INPUT_DELAY_FRAMES,
      () => this.inputReader.getInput(),
      (frame, input) => {
        conn.send({ type: "input", frame: frame, input: input.serialize() });
      },
      (frame, state) => {
        conn.send({ type: "state", frame: frame, state: state });
      }
    );

    conn.on("data", (data) => {
      if (this.rollbackNetcode!.ended) {
        conn.close()
        return
      }
      if (data.type === "input") {
        const input = new MyInput();
        input.deserialize(data.input);
        this.rollbackNetcode!.onRemoteInput(data.frame, players![1], input);
      } else if (data.type == "ping-req") {
        conn.send({ type: "ping-resp", sent_time: data.sent_time });
      } else if (data.type == "ping-resp") {
        this.pingMeasure.update(Date.now() - data.sent_time);
      }
    });

    conn.on("open", () => {
      console.log("Client has connected... Starting game...");
      this.checkChannel(conn.dataChannel);
      store.dispatch({ type: SET_NETPLAY_DATA, payload: { connectedToPeer: true } })
      store.dispatch({ type: SET_UI_DATA, payload: { isMainMenuOpen: false } })

      this.pingIntervalHandle = setInterval(() => {
        if (this.rollbackNetcode!.ended) {
          if (this.pingIntervalHandle) clearInterval(this.pingIntervalHandle)
          return
        }
        conn.send({ type: "ping-req", sent_time: Date.now() });
      }, PING_INTERVAL);

      this.startGameLoop(store);
    });
  }

  startClient(players: Array<NetplayPlayer>, conn: DataConnection, store: Store) {
    console.info("Starting a rollback client.");

    this.game = new MyGame(this.roomCode ?? '', store);
    store.dispatch({ type: SET_CURRENT_GAME, payload: this.game });
    store.dispatch({ type: SET_NETPLAY_DATA, payload: { delayFrames: INPUT_DELAY_FRAMES } })

    this.rollbackNetcode = new RollbackNetcode(
      false,
      this.game!,
      players,
      this.getInitialInputs(players),
      10,
      this.pingMeasure,
      MyGame.timestep,
      INPUT_DELAY_FRAMES,
      () => this.inputReader.getInput(),
      (frame, input) => {
        conn.send({ type: "input", frame: frame, input: input.serialize() });
      }
    );

    conn.on("data", (data) => {
      if (this.rollbackNetcode!.ended) {
        conn.close()
        return
      }
      if (data.type === "input") {
        const input = new MyInput();
        input.deserialize(data.input);
        this.rollbackNetcode!.onRemoteInput(data.frame, players![0], input);
      } else if (data.type === "state") {
        //console.log(data.state)
        this.rollbackNetcode!.onStateSync(data.frame, data.state);
      } else if (data.type == "ping-req") {
        conn.send({ type: "ping-resp", sent_time: data.sent_time });
      } else if (data.type == "ping-resp") {
        this.pingMeasure.update(Date.now() - data.sent_time);
      }
    });
    conn.on("open", () => {
      console.log("Successfully connected to server... Starting game...");
      this.checkChannel(conn.dataChannel);
      store.dispatch({ type: SET_NETPLAY_DATA, payload: { connectedToPeer: true } })
      store.dispatch({ type: SET_UI_DATA, payload: { isMainMenuOpen: false } }) // TODO this shouldn't need to be here

      this.pingIntervalHandle = setInterval(() => {
        if (this.rollbackNetcode!.ended) {
          if (this.pingIntervalHandle) clearInterval(this.pingIntervalHandle)
          return
        }
        conn.send({ type: "ping-req", sent_time: Date.now() });
      }, PING_INTERVAL);

      this.startGameLoop(store);
    });
    conn.on("close", () => {
      // In this case the host ended the session without the client detecting a game end itself.
      // We always hit this path for some reason. I guess someone has to close it first?
      // TODO Pretty sure the client can properly detect end at state sync stages, not history clearing stages.
      if (!this.rollbackNetcode!.ended) {
        if (this.pingIntervalHandle) clearInterval(this.pingIntervalHandle)
      }
    })
  }

  startGameLoop(store: Store) {
    // Start the netcode game loop.
    this.rollbackNetcode!.start();

    const animate = () => {
      // Draw state to canvas.
      this.game!.draw(this.canvas);

      // Send debug logs to redux
      if (this.rollbackNetcode!.currentFrame() % 10 === 0) {
        store.dispatch({ type: SET_NETPLAY_DATA, payload: {
          ping: this.pingMeasure.average().toFixed(0),
          pingStdDev: this.pingMeasure.stddev().toFixed(0),
          historyLength: this.rollbackNetcode!.history.length,
          largestFutureSize: this.rollbackNetcode!.largestFutureSize(),
          predictedFrames: this.rollbackNetcode!.predictedFrames(),
          stalling: this.rollbackNetcode!.shouldStall(),
        }})
      }

      // Request another frame.
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}
