import { Button, Card, Input, message, Radio, Space, Typography } from "antd"
import { useCallback } from "react"
import { useDispatch, useSelector, useStore } from "react-redux"
import styled from "styled-components"
import { SingleClientGame } from "../Game/GameService/SingleClientGame"
import { SET_CURRENT_GAME, SET_UI_DATA } from "../redux/actions"
import { AppState } from "../redux/reducer"
import { useTypedSelector } from "../redux/typedHooks"
import { ResourceBadge } from "./ResourceBadge"

const { Text, Title } = Typography

const ControlsSummaryWrapper = styled.div`
  height: 100%;
  display: flex;

  > :not(:last-child) {
    margin-right: 5px;
  }
`

const ControlBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Divider = styled.div`
  width: calc(100% - 4px);
  height: 1px;
  background-color: rgba(0, 0, 0, 0.2);
`

export type ControlsSummaryProps = {
  playerIndex: number;
}

export const ControlsSummary = ({playerIndex}: ControlsSummaryProps) => {

  return (
    <ControlsSummaryWrapper>
      <ControlBox>
        <Title level={5} style={{margin: 0, padding: '2px 8px'}}>
          Move
        </Title>
        <Divider />
        <Text style={{transform: 'translateY(3px)'}}>
          W
        </Text>
        <Text>
          A S D
        </Text>
      </ControlBox>
      <ControlBox>
        <Title level={5} style={{margin: 0, padding: '2px 8px'}}>
          Attract
        </Title>
        <Divider />
        <Text style={{fontSize: 24}}>
          Q
        </Text>
      </ControlBox>
      <ControlBox>
        <Title level={5} style={{margin: 0, padding: '2px 8px'  }}>
          Repel
        </Title>
        <Divider />
        <Text style={{fontSize: 24}}>
          H
        </Text>
      </ControlBox>
    </ControlsSummaryWrapper>
  )
}
