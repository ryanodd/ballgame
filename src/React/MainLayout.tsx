import React from 'react';
import styled from 'styled-components';
import { useTypedSelector } from '../redux/typedHooks';
import { AspectRatioLetterbox } from './AspectRatioLetterbox';
import { GameCanvas } from './GameCanvas';
import { NetplayMenu } from './NetplayMenu';

const MainLayoutContainer = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const MainLayout = () => {
  const { joinUrl } = useTypedSelector(({netplay}) => {
    return {
      joinUrl: netplay.joinUrl
    }
  })
  const shouldShowNetplayMenu = joinUrl
  return (
    <MainLayoutContainer>
      <AspectRatioLetterbox>
        <GameCanvas />
      </AspectRatioLetterbox>
      { shouldShowNetplayMenu && (
        <NetplayMenu />
      )}
      {/* <score-box />
      <netplay-stats v-if="this.shouldShowNetplayStats" /> */}
    </MainLayoutContainer>
  );
}
