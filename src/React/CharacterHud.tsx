import { Button, Card, Input, message, Radio, Space, Typography } from "antd"
import { useCallback } from "react"
import { useDispatch, useSelector, useStore } from "react-redux"
import styled from "styled-components"
import { SingleClientGame } from "../Game/GameService/SingleClientGame"
import { SET_CURRENT_GAME, SET_UI_DATA } from "../redux/actions"
import { AppState } from "../redux/reducer"
import { useTypedSelector } from "../redux/typedHooks"
import { ControlsSummary } from "./ControlsSummary"
import { ResourceBadge } from "./ResourceBadge"

const { Text, Title } = Typography

const CharacterHudWrapper = styled.div`
  height: 100%;
  
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  padding: 0 4px 0 6px;

  display: flex;
`

const SummaryColumn = styled.div`
  width: 180px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`

const TitleRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`

const ResourceRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  margin-top: -4px;
`

const ResourceBar = styled.div`
  margin-left: -4px;
  flex-grow: 1;
  height: 25px;
  background-color: rgba(150, 150, 150, 1);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  //border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  border-left: none;

  overflow: hidden;
  position: relative;
`

const ResourceBarFill = styled.div<{ percent: number, color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${props => props.percent}%;

  background-color: ${props => props.color};
`

const Divider = styled.div`
  margin: 5px 10px;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.4);
`

export type CharacterHudProps = {
  playerIndex: number
}

export const CharacterHud = ({playerIndex}: CharacterHudProps) => {
  console.log(playerIndex)
  const { color, resourceMeter } = useTypedSelector((state) => ({
    color: state.game.teams[state.game.characters[playerIndex].teamIndex].color,
    resourceMeter: state.game.characters[playerIndex].resourceMeter,
  }))
  const numberToDisplay = Math.round(resourceMeter)

  const resourceMeterPercent = numberToDisplay

  return (
    <CharacterHudWrapper>
      <SummaryColumn>
        <TitleRow>
          <Title level={4} style={{margin: '0 0 0 4px'}}>
            Player
          </Title>
        </TitleRow>
        <ResourceRow>
          <ResourceBadge number={numberToDisplay} />
          <ResourceBar>
            <ResourceBarFill percent={resourceMeterPercent} color={color}/>
          </ResourceBar>
        </ResourceRow>
      </SummaryColumn>
      <Divider />
      <ControlsSummary playerIndex={playerIndex}/>
    </CharacterHudWrapper>
  )
}
