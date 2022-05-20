import styled from "styled-components";

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  // background-color: rgb(42, 43, 49);
`

const CanvasElement = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export const GameCanvas = () => {
  return (
    <CanvasContainer>
      <CanvasElement id="game-canvas"/>
      {/* <CanvasOverlay /> */}
    </CanvasContainer>
  )
}
