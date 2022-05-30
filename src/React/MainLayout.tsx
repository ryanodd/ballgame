import styled from 'styled-components';
import { useTypedSelector } from '../redux/typedHooks';
import { AspectRatioLetterbox } from './AspectRatioLetterbox';
import { GameCanvas } from './GameCanvas';
import { NetplayMenu } from './NetplayMenu';
import { Button, Drawer, Modal, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { SET_UI_DATA } from '../redux/actions';
import { LocalPlayMenu } from './LocalPlayMenu';
import { GameEndMenu } from './GameEndMenu';
import { NetplayStats } from './NetplayStats';

const MainLayoutContainer = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const MainLayout = () => {
  const {
    connectedToPeer,
    errorMessage,
    joinUrl,
    isGameEndOpen,
    isMainMenuOpen
  } = useTypedSelector(({netplay, ui}) => {
    return {
      connectedToPeer: netplay.connectedToPeer,
      errorMessage: netplay.errorMessage,
      joinUrl: netplay.joinUrl,
      isMainMenuOpen: ui.isMainMenuOpen,
      isGameEndOpen: ui.isGameEndOpen,
    }
  })
  const dispatch = useDispatch()

  return (
    <MainLayoutContainer>
      <Modal
        width="min-content"
        closable={false}
        visible={isGameEndOpen}
        footer={[
          <Button key="ok" type="primary" onClick={() => {
            dispatch({type: SET_UI_DATA, payload: { isGameEndOpen: false } })
            dispatch({type: SET_UI_DATA, payload: { isMainMenuOpen: true } })
          }}>
            OK
          </Button>
        ]}
      >
        <GameEndMenu />
      </Modal>
      <Modal
        // title="SpicyMeatball.io"
        width="min-content"
        closable={false}
        footer={null}
        visible={isMainMenuOpen}
      >
        <Space direction="vertical" style={{width: '100%'}}>
          <NetplayMenu />
          <LocalPlayMenu />
        </Space>
      </Modal>
      <AspectRatioLetterbox>
        <GameCanvas />
      </AspectRatioLetterbox>
      { connectedToPeer && (
        <NetplayStats />
      )}
    </MainLayoutContainer>
  );
}
