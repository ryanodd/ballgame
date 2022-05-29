import styled, { keyframes } from "styled-components"
import { useTypedSelector } from "../redux/typedHooks"

const CanvasAnimationOverlayContainer = styled.div`
  position: absolute;
  inset: 0;
`

const CountdownAnimationContainer = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`

const countdownNumberAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1.15);
    opacity: 0;
  }
`

const CountdownNumber = styled.h1`
  margin: 0;
  font-size: 200px;
  text-shadow: 2px 2px rgba(0, 0, 0, 0.2);
  animation-name: ${countdownNumberAnimation};
  animation-duration: 1s;
`

export const CanvasAnimationOverlay = () => {
  const { countdownFrames } = useTypedSelector(state => ({
    countdownFrames: state.game.countdownFrames,
  }))
  
  return (
    <CanvasAnimationOverlayContainer>
      {
        countdownFrames > 0 && (
          <CountdownAnimationContainer>
            {Math.ceil(countdownFrames / 60) === 3 && (
              <CountdownNumber>
                3
              </CountdownNumber>
            )}
            {Math.ceil(countdownFrames / 60) === 2 && (
              <CountdownNumber>
                2
              </CountdownNumber>
            )}
            {Math.ceil(countdownFrames / 60) === 1 && (
              <CountdownNumber>
                1
              </CountdownNumber>
            )}
          </CountdownAnimationContainer>
        )
      }
    </CanvasAnimationOverlayContainer>
  )
}
