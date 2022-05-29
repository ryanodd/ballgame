import React, { useEffect } from "react";
import styled from "styled-components";
import { MainLayout } from "./MainLayout";
import { useDispatch, useStore } from "react-redux";
import { MyRollbackWrapper } from "../Game/GameService/netplayjs/myRollbackWrapper";
import { SingleClientGame } from "../Game/GameService/SingleClientGame";
import {
  SET_CURRENT_GAME,
  SET_NETPLAY_DATA,
  SET_UI_DATA,
} from "../redux/actions";
import * as query from "query-string";

const GamePageContainer = styled.div`
  font-family: "play", "Roboto", Helvetica, Avenir, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width: 100vw;
  height: 100vh;

  //background: linear-gradient(to top right,rgb(20, 20, 20), rgb(29, 29, 29));
`;

const GamePage = () => {
  const store = useStore();
  const dispatch = useDispatch();

  useEffect(() => {
    // Grab query string of room code & decide whether we're host or client
    const parsedHash = query.parse(window.location.hash);
    const removeHash = () => {
      history.replaceState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    };
    removeHash();
    const clientRoomCode =
      typeof parsedHash.room === "string" ? parsedHash.room : null;
    const isHost = !clientRoomCode;

    dispatch({ type: SET_NETPLAY_DATA, isHost: isHost });
    dispatch({ type: SET_UI_DATA, payload: { isMainMenuOpen: isHost } });

    if (!isHost) {
      const rollbackedGame = new MyRollbackWrapper(clientRoomCode);
      rollbackedGame.start(store);
    }
  }, []);

  return (
    <GamePageContainer>
      <MainLayout />
    </GamePageContainer>
  );
};

// Need to use default export when using dynamic import
export default GamePage;
