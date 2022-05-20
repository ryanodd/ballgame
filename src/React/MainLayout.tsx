import styled from 'styled-components';
import { useTypedSelector } from '../redux/typedHooks';
import * as query from "query-string";
import { AspectRatioLetterbox } from './AspectRatioLetterbox';
import { GameCanvas } from './GameCanvas';
import { NetplayMenu } from './NetplayMenu';
import { Drawer, Modal, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { SET_UI_DATA } from '../redux/actions';
import { LocalPlayMenu } from './LocalPlayMenu';

const MainLayoutContainer = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const MainLayout = () => {
  const { connectedToPeer, errorMessage, joinUrl, isMainDrawerOpen } = useTypedSelector(({netplay, ui}) => {
    return {
      connectedToPeer: netplay.connectedToPeer,
      errorMessage: netplay.errorMessage,
      joinUrl: netplay.joinUrl,
      isMainDrawerOpen: ui.isMainDrawerOpen,
    }
  })
  const dispatch = useDispatch()

  return (
    <MainLayoutContainer>
      <Modal
        // title="SpicyMeatball.io"
        // placement="left"
        width="min-content"
        closable={false}
        footer={null}
        // onClose={() => {dispatch({type: SET_UI_DATA, payload: { isMainDrawerOpen: false } })}}
        visible={isMainDrawerOpen}
      >
        <Space direction="vertical" style={{width: '100%'}}>
          <NetplayMenu />
          <LocalPlayMenu />
        </Space>
      </Modal>
      <AspectRatioLetterbox>
        <GameCanvas />
      </AspectRatioLetterbox>
      {/* <score-box />
      { shouldShowNetplayStats && (
        <NetplayStats />
      )}
      <netplay-stats v-if="this.shouldShowNetplayStats" /> */}
    </MainLayoutContainer>
  );
}
