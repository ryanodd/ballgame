import { Button, Card, Input, message, Radio, Space, Typography } from "antd"
import { useCallback } from "react"
import { useDispatch, useSelector, useStore } from "react-redux"
import styled from "styled-components"
import { SingleClientGame } from "../Game/GameService/SingleClientGame"
import { SET_CURRENT_GAME, SET_UI_DATA } from "../redux/actions"
import { AppState } from "../redux/reducer"
import { useTypedSelector } from "../redux/typedHooks"

const { Text, Title } = Typography

const ScoreBoxWrapper = styled.div`

`

export const ScoreBox = () => {
  const { framesRemaining, overtime, teams } = useTypedSelector((state) => {
    return {
      framesRemaining: state.game.framesRemaining,
      overtime: state.game.overtime,
      teams: state.game.teams,
    }
  })


  let secondsRemaining = Math.ceil((framesRemaining ?? 0) / 60)
  let minutesRemaining = 0
  if (secondsRemaining > 59) {
    minutesRemaining = secondsRemaining / 60
    secondsRemaining = secondsRemaining % 60
  }
  return (
    <ScoreBoxWrapper>
      <Title level={1} style={{margin: 0}}>
        {teams[0] && teams[1] &&
          `${teams[0]?.score} - ${teams[1]?.score}`
        }
      </Title>
        { framesRemaining !== null && (
          <Text>
            {`${minutesRemaining.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`}
          </Text>
        )}
        { overtime === true && (
          <Text>
            {'NEXT GOAL WINS'}
          </Text>
        )}
    </ScoreBoxWrapper>
  )
}
