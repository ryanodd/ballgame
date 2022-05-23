import { Button, Card, Input, message, Space, Typography } from "antd"
import { useCallback } from "react"
import { useSelector, useStore } from "react-redux"
import styled from "styled-components"
import { AppState } from "../redux/reducer"
import { useTypedSelector } from "../redux/typedHooks"

const { Text, Title } = Typography

const GameEndMenuWrapper = styled.div`
  width: 500px;
  /* position: absolute;
  bottom: 5px;
  left: 5px; */
`

export const GameEndMenu = () => {

  const { teams } = useTypedSelector((state) => {
    return {
      teams: state.game.teams
    }
  })

  // We don't handle ties 'round these parts
  const winningTeamName = teams[0].score >= teams[1].score ? 'Team 1' : 'Team 2'

  return (
    <GameEndMenuWrapper>
      <Card style={{overflowX: 'auto', overflowY: 'hidden'}}>
        <Title level={2}>
          {`${winningTeamName} wins!`}
        </Title>
        <Space direction="vertical" size="small">
          <Text>
            {`${teams[0].score} - ${teams[1].score}`}
          </Text>
        </Space>
      </Card>
    </GameEndMenuWrapper>
  )
}
