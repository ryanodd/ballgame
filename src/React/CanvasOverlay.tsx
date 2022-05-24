import { ReactNode, useCallback, useEffect, useState } from "react"
import styled from "styled-components"

const CanvasOverlayContainer = styled.div<{heightPercent: string}>`
  position: absolute;
  top: 0;
  bottom calc(100% - ${props => props.heightPercent}%);

  width: 100%;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;
  justify-content: stretch;
`

const ChildWrapper = styled.div<{targetHeight: number}>`
  position: absolute;
  left: 50%;

  width: calc(80px * 9 * (16/9));
  height: 75px;
  margin-top: 5px;
  transform: translateX(-50%) scale(calc(${props => props.targetHeight}/80));

  display: flex;
  align-items: stretch;
  justify-content: stretch;
`

// This is logically tied to scene1's 8/9 height
const PERCENT_HEIGHT = ((1 / 9) * 100).toFixed(0)

export type CanvasContainerProps = {
  children: ReactNode;
}

export const CanvasOverlay = ({children}: CanvasContainerProps) => {
  const [ targetHeight, setTargetHeight ] = useState(0)

  const onResize = useCallback(() => {
    setTimeout(() => {
      const container = document.querySelector('#canvas-overlay-container')
      if (container !== null) {
        setTargetHeight(container.getBoundingClientRect().height)
      }
    }, 0) // Shhh... It works now
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
