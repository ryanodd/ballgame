import styled from "styled-components";
import { useTypedSelector } from "../redux/typedHooks";
import { CanvasOverlay } from "./CanvasOverlay";
import { ScoreBox } from "./ScoreBox";
import { TeamHud } from "./TeamHud";

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
  const { teams } = useTypedSelector((state) => {
    return {
      teams: state.game.teams,
    }
  })
  
  return (
    <CanvasContainer>
      <CanvasElement id="game-canvas"/>
      <CanvasOverlay>
        {
          teams !== [] && (
            <>
              <TeamHud teamIndex={0} />
              <ScoreBox />
              <TeamHud teamIndex={1} />
            </>
          )
        }
        
      </CanvasOverlay>
    </CanvasContainer>
  )
}
