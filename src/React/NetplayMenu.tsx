import { Button, Card, Input, message, Space, Typography } from "antd"
import { useCallback, useEffect } from "react"
import { useSelector, useStore } from "react-redux"
import styled from "styled-components"
import { MyRollbackWrapper } from "../Game/GameService/netplayjs/myRollbackWrapper"
import { SET_CURRENT_GAME, SET_NETPLAY_DATA } from "../redux/actions"
import { AppState } from "../redux/reducer"
import { useTypedDispatch, useTypedSelector } from "../redux/typedHooks"

const { Text, Title } = Typography

const NetplayMenuWrapper = styled.div`
  /* position: absolute;
  bottom: 5px;
  left: 5px; */
`

const NetplayMenuColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  :not(:last-child) {
    margin-bottom: 8px;
  }
  padding: 4px;
`

export const NetplayMenu = () => {

  const store = useStore()
  const dispatch = useTypedDispatch()
  const { joinUrl, isMainMenuOpen } = useTypedSelector((state) => {
    return {
      isMainMenuOpen: state.ui.isMainMenuOpen,
      joinUrl: state.netplay.joinUrl
    }
  })

  // Start a new game as the host when this menu appears.
  // This starts the peerjs portion of the game, so we can access our room code and listen for joiners
  // inside that, the game will just start when someone joins the session
  // TODO expose joining interface AND game starting interface, so we can do both separately from react 
  useEffect(() => {
    if (isMainMenuOpen) {
      const game = new MyRollbackWrapper(null)
      dispatch({type: SET_CURRENT_GAME, payload: game })
      dispatch({type: SET_NETPLAY_DATA, payload: {
        isHost: true,
      } })
      game.start(store)
    }
  }, [isMainMenuOpen])

  const copyToClipboard = useCallback(() => {
    if (joinUrl) {
      message.success('Copied to clipboard.');
      window.navigator.clipboard.writeText(joinUrl)
    }

  }, [joinUrl])

  return (
    <NetplayMenuWrapper>
      <Card style={{overflowX: 'auto', overflowY: 'hidden'}}>
        {/* <Space direction="vertical" size="small"> */}
          <Title level={2}>
            Play Online
          </Title>
          <Space direction="vertical" size="small">
            <Text>
              The game will begin when someone else enters this URL into their browser.
            </Text>
            <Space>
              {/* <Title code level={4}>
                {joinUrl}
              </Title> */}
              <Input size="large" value={joinUrl ?? ''} style={{width: 550}} />
              <Button size="large" type="primary" onClick={copyToClipboard}>
                Copy
              </Button>
            </Space>
            
          </Space>
        {/* </Space> */}
      </Card>
    </NetplayMenuWrapper>
  )
}
