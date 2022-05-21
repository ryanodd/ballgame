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
  const { teams } = useTypedSelector((state) => {
    return {
      teams: state.teams,
    }
  })
  return (
    <ScoreBoxWrapper>
      <Title level={1} style={{margin: 0}}>
        {teams[0] && teams[1] &&
          `${teams[0]?.score} - ${teams[1]?.score}`
        }
      </Title>
    </ScoreBoxWrapper>
  )
}
