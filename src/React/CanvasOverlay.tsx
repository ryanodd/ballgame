import { Button, Card, Input, message, Radio, Space, Typography } from "antd"
import { ReactNode, useCallback, useEffect, useState } from "react"
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

const ChildWrapper = styled.div<{targetHeight: number}>`
  height: 80px;
  transform: scale(calc(${props => props.targetHeight}/80));
  
  position: relative;
`

// This is logically tied to scene1's 8/9 height
const PERCENT_HEIGHT = ((1 / 9) * 100).toFixed(0)

export type CanvasContainerProps = {
  children: ReactNode;
}

export const CanvasOverlay = ({children}: CanvasContainerProps) => {
  const { teams } = useTypedSelector((state) => {
    return {
      teams: state.game.teams,
    }
  })

  const [ targetHeight, setTargetHeight ] = useState(0)

  const onResize = useCallback(() => {
    const container = document.querySelector('#canvas-overlay-container')
    if (container !== null) {
      setTargetHeight(container.getBoundingClientRect().height)
    }
  }, [])

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <CanvasOverlayContainer id="canvas-overlay-container" heightPercent={PERCENT_HEIGHT} >
      <ChildWrapper id="canvas-overlay-content" targetHeight={targetHeight}>
        {children}
      </ChildWrapper>
    </CanvasOverlayContainer>
  )
}
