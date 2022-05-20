import React, { useEffect } from 'react';
import styled from 'styled-components';
import { MainLayout } from './MainLayout';
import { useStore } from 'react-redux';
import { MyRollbackWrapper } from '../Game/GameService/netplayjs/myRollbackWrapper';
import { SingleClientGame } from '../Game/GameService/SingleClientGame';

const GamePageContainer = styled.div`
  font-family: 'Roboto', Helvetica, Avenir, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width: 100vw;
  height: 100vh;

  //background: linear-gradient(to top right,rgb(20, 20, 20), rgb(29, 29, 29)); 
`

const GamePage = () => {

  const store = useStore()

  useEffect(() => {
    new SingleClientGame().start()
    //new MyRollbackWrapper().start(store);
  }, [])

  return (
    <GamePageContainer>
      <MainLayout />
    </GamePageContainer>
  );
}

// Need to use default export when using dynamic import
export default GamePage
