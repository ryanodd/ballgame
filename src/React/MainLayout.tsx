import React from 'react';
import styled from 'styled-components';
import { AspectRatioLetterbox } from './AspectRatioLetterbox';
import { GameCanvas } from './GameCanvas';

const MainLayoutContainer = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const MainLayout = () => {
  return (
    <MainLayoutContainer>
      <AspectRatioLetterbox>
        <GameCanvas />
      </AspectRatioLetterbox>
      {/* <score-box />
      <netplay-menu v-if="this.shouldShowNetplayMenu" />
      <netplay-stats v-if="this.shouldShowNetplayStats" /> */}
    </MainLayoutContainer>
  );
}
