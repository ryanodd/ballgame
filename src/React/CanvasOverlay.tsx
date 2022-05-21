import { Button, Card, Input, message, Radio, Space, Typography } from "antd"
import { ReactNode, useCallback } from "react"
import { useDispatch, useSelector, useStore } from "react-redux"
import styled from "styled-components"
import { SingleClientGame } from "../Game/GameService/SingleClientGame"
import { SET_CURRENT_GAME, SET_UI_DATA } from "../redux/actions"
import { AppState } from "../redux/reducer"
import { useTypedSelector } from "../redux/typedHooks"

const { Text, Title } = Typography

const CanvasOverlayContainer = styled.div<{heightPercent: string}>`
  position: absolute;
  top: 0;
  bottom calc(100% - ${props => props.heightPercent}%);

  width: 100%;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;
  justify-content: center;
`

// This is logically tied to scene1's 8/9 height
const PERCENT_HEIGHT = ((1 / 9) * 100).toFixed(0)

export type CanvasContainerProps = {
  children: ReactNode;
}

export const CanvasOverlay = ({children}: CanvasContainerProps) => {
  const { teams } = useTypedSelector((state) => {
    return {
      teams: state.teams,
    }
  })
  return (
    <CanvasOverlayContainer heightPercent={PERCENT_HEIGHT} >
      {children}
    </CanvasOverlayContainer>
  )
}
