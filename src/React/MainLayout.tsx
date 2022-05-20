import styled from 'styled-components';
import { useTypedSelector } from '../redux/typedHooks';
import * as query from "query-string";
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
  const { connectedToPeer, errorMessage, joinUrl } = useTypedSelector(({netplay}) => {
    return {
      connectedToPeer: netplay.connectedToPeer,
      errorMessage: netplay.errorMessage,
      joinUrl: netplay.joinUrl
    }
  })

  // Quick & dirty hack to see whether we're the host tab
  const parsedHash = query.parse(window.location.hash);
  const isHost = !parsedHash.room;

  const shouldShowNetplayMenu = (isHost && !connectedToPeer) && joinUrl !== null
  // I'm guessing these are the only times we'd want to see it
  const shouldShowNetplayStats = connectedToPeer || errorMessage

  return (
    <MainLayoutContainer>
      <AspectRatioLetterbox>
        <GameCanvas />
      </AspectRatioLetterbox>
      { shouldShowNetplayMenu && (
        <NetplayMenu />
      )}
      {/* <score-box />
      { shouldShowNetplayStats && (
        <NetplayStats />
      )}
      <netplay-stats v-if="this.shouldShowNetplayStats" /> */}
    </MainLayoutContainer>
  );
}
