import Peer from 'peerjs'
import { DefaultInput } from '@/lib/netplayjs/defaultinput'
import EWMASD from '@/lib/netplayjs/ewmasd'
import { NetplayPlayer } from '@/lib/netplayjs/types'

import { Game, GameClass } from '@/lib/netplayjs/game'
import { RollbackNetcode } from '@/lib/netplayjs/netcode/rollback'
import { MyInputReader } from './MyInput'

import * as query from "query-string";
import { assert } from "chai";
import { VueService } from '@/Game/VueService/VueService'

const PING_INTERVAL = 100;

export class MyRollbackWrapper {

  // The class (not the instance) of the input serializable game (myGame)
  gameClass: GameClass;

  /** The canvas that the game will be rendered onto. */
  canvas: HTMLCanvasElement;

  vueService: typeof VueService = VueService;

  inputReader: MyInputReader;

  stateSyncPeriod: number;

  pingMeasure: EWMASD = new EWMASD(0.2); // Ryan: I don't know what this 0.2 does

  // The actual instance of the input serializable game class 
  game?: Game;

  rollbackNetcode?: RollbackNetcode<Game, DefaultInput>;

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

  constructor(gameClass: GameClass) {
    this.gameClass = gameClass;

    this.stateSyncPeriod = this.gameClass.stateSyncPeriod || 1;

    // Find canvas for game.
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement

    if (
      this.gameClass.touchControls &&
      window.navigator.userAgent.toLowerCase().includes("mobile")
    ) {
      for (const [name, control] of Object.entries(
        this.gameClass.touchControls
      )) {
        control.show();
      }
    }

    this.inputReader = new MyInputReader(
      this.canvas,
      this.gameClass.pointerLock || false,
      this.gameClass.touchControls || {}
    );
  }

  peer?: Peer;

  start() {
    console.info("Creating a PeerJS instance.");
    this.vueService.setNetplayConnectingToServer(true)

    this.peer = new Peer();
    this.peer.on("error", (err) => {
      this.vueService.setNetplayErrorMessage(JSON.stringify(err))
      console.error(err);
    });

    this.peer!.on("open", (id) => {
      this.vueService.setNetplayConnectingToServer(false)

      // Try to parse the room from the hash. If we find one,
      // we are a client.
      const parsedHash = query.parse(window.location.hash);
      const isClient = !!parsedHash.room;

      if (isClient) {
        // We are a client, so connect to the room from the hash.
        this.vueService.setNetplayConnectedToPeer(true)

        console.info(`Connecting to room ${parsedHash.room}.`);

        const conn = this.peer!.connect(parsedHash.room as string, {
          serialization: "json",
          reliable: true,
          // @ts-ignore: This is a hack written by netplayjs to get around a bug in PeerJS
          _payload: {
            originator: true,
            reliable: true,
          },
        });

        conn.on("error", (err) => {
          this.vueService.setNetplayErrorMessage(JSON.stringify(err))
          console.error(err)
        });

        // Construct the players array.
        const players = [
          new NetplayPlayer(0, false, true), // Player 0 is our peer, the host.
          new NetplayPlayer(1, true, false), // Player 1 is us, a client
        ];

        this.startClient(players, conn);
      } else {
        // HOST
        // We are host, so we need to show a join link.
        console.info("Showing join link.");

        // Show the join link.
        const joinURL = `${window.location.href}#room=${id}`;
        this.vueService.setNetplayJoinUrl(joinURL)

        // Construct the players array.
        const players = [
          new NetplayPlayer(0, true, true), // Player 0 is us, acting as a host.
          new NetplayPlayer(1, false, false), // Player 1 is our peer, acting as a client.
        ];

        // Wait for a connection from a client.
        this.peer!.on("connection", (conn) => {
          // Make the menu disappear.
          this.vueService.setNetplayConnectedToPeer(true)
          
          conn.on("error", (err) => {
            this.vueService.setNetplayErrorMessage(JSON.stringify(err))
            console.error(err)
          });

          this.startHost(players, conn);
        });
      }
    });
  }

  getInitialInputs(
    players: Array<NetplayPlayer>
  ): Map<NetplayPlayer, DefaultInput> {
    const initialInputs: Map<NetplayPlayer, DefaultInput> = new Map();
    for (const player of players) {
      initialInputs.set(player, new DefaultInput());
    }
    return initialInputs;
  }

  startHost(players: Array<NetplayPlayer>, conn: Peer.DataConnection) {
    console.info("Starting a rollback host.");

    this.game = new this.gameClass(this.canvas, players);

    this.rollbackNetcode = new RollbackNetcode(
      true,
      this.game!,
      players,
      this.getInitialInputs(players),
      10,
      this.pingMeasure,
      this.gameClass.timestep,
      () => this.inputReader.getInput(),
      (frame, input) => {
        conn.send({ type: "input", frame: frame, input: input.serialize() });
      },
      (frame, state) => {
        conn.send({ type: "state", frame: frame, state: state });
      }
    );

    conn.on("data", (data) => {
      if (data.type === "input") {
        const input = new DefaultInput();
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

      setInterval(() => {
        conn.send({ type: "ping-req", sent_time: Date.now() });
      }, PING_INTERVAL);

      this.startGameLoop();
    });
  }

  startClient(players: Array<NetplayPlayer>, conn: Peer.DataConnection) {
    console.info("Starting a lockstep client.");

    this.game = new this.gameClass(this.canvas, players);
    this.rollbackNetcode = new RollbackNetcode(
      false,
      this.game!,
      players,
      this.getInitialInputs(players),
      10,
      this.pingMeasure,
      this.gameClass.timestep,
      () => this.inputReader.getInput(),
      (frame, input) => {
        conn.send({ type: "input", frame: frame, input: input.serialize() });
      }
    );

    conn.on("data", (data) => {
      if (data.type === "input") {
        const input = new DefaultInput();
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

      setInterval(() => {
        conn.send({ type: "ping-req", sent_time: Date.now() });
      }, PING_INTERVAL);

      this.startGameLoop();
    });
  }

  startGameLoop() {
    // Start the netcode game loop.
    this.rollbackNetcode!.start();

    const animate = (timestamp) => {
      // Draw state to canvas.
      this.game!.draw(this.canvas);

      // Update stats
      this.vueService.setNetplayPing(this.pingMeasure.average().toFixed(2))
      this.vueService.setNetplayPingStdDev(this.pingMeasure.stddev().toFixed(2))
      this.vueService.setNetplayHistoryLength(this.rollbackNetcode!.history.length)
      this.vueService.setNetplayFrame(this.rollbackNetcode!.currentFrame())
      this.vueService.setNetplayLargestFutureSize(this.rollbackNetcode!.largestFutureSize())
      this.vueService.setNetplayPredictedFrames(this.rollbackNetcode!.predictedFrames())
      this.vueService.setNetplayStalling(this.rollbackNetcode!.shouldStall())

      // Request another frame.
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}
