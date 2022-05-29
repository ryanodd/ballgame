import { Button, Card, Space, Typography } from "antd"
import { useCallback } from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { SingleClientGame } from "../Game/GameService/SingleClientGame"
import { SET_CURRENT_GAME, SET_UI_DATA } from "../redux/actions"

const { Text, Title } = Typography

const LocalPlayMenuWrapper = styled.div`
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

export const LocalPlayMenu = () => {
  const dispatch = useDispatch()
  const onStart = useCallback(() => {
    const game = new SingleClientGame()
    dispatch({type: SET_CURRENT_GAME, payload: game })
    game.start()
    dispatch({type: SET_UI_DATA, payload: { isMainMenuOpen: false } })
  }, [])
  return (
    <LocalPlayMenuWrapper>
      <Card>
        {/* <Space direction="vertical" size="small"> */}
          <Title level={2}>
            Play Offline
          </Title>
          <Space direction="vertical" size="middle">
            {/* <Radio.Group defaultValue="a" size="large" optionType="button">
              <Radio.Button value="a">vs. Human</Radio.Button>
              <Radio.Button value="b">vs. CPU</Radio.Button>
            </Radio.Group> */}
              <Text>
                Start a player-vs-player game on this computer.
              </Text>
              <Button
                size="large"
                type="primary"
                onClick={onStart}
              >
                Start Game
              </Button>
            
          </Space>
        {/* </Space> */}
      </Card>
    </LocalPlayMenuWrapper>
  )
}
