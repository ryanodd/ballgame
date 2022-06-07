import { Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { GAME_FRAMERATE } from "../Game/GameService/constants";
import { useTypedSelector } from "../redux/typedHooks";

const { Text, Title } = Typography;

const ScoreBoxWrapper = styled.div`
  width: 200px;
  height: 100%;

  /* background-color: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5); */

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const scoreAnimation = keyframes`
  0% {

  }
  10% {
    transform: scale(1.4);
    transform-origin: top center;
  }
  100% {
    
  }
`

const ScoreTextWrapper = styled.div<{animateScore: boolean}>`
  ${(props) =>
    props.animateScore &&
    css`
      animation-name: ${scoreAnimation};
      animation-duration: 1s;
    `
  }
`

export const ScoreBox = () => {
  const { framesRemaining, overtime, team1Score, team2Score } = useTypedSelector((state) => {
    return {
      framesRemaining: state.game.framesRemaining,
      overtime: state.game.overtime,
      team1Score: state.game.teams[0]?.score,
      team2Score: state.game.teams[1]?.score,
    };
  });


  const [scoreAnimationPlaying, setScoreAnimationPlaying] = useState(false);
  useEffect(() => {
    if (team1Score !== 0 || team2Score !== 0) {
      setScoreAnimationPlaying(true)
    }
  }, [team1Score, team2Score])
  const onScoreAnimationEnd = useCallback(() => {
    setScoreAnimationPlaying(false);
  }, []);

  let secondsRemaining = Math.ceil((framesRemaining ?? 0) / GAME_FRAMERATE);
  const isFinalCountdown = secondsRemaining <= 10 && secondsRemaining > 0;
  let minutesRemaining = 0;
  if (secondsRemaining > 59) {
    minutesRemaining = Math.floor(secondsRemaining / 60);
    secondsRemaining = secondsRemaining % 60;
  }

  const timerStyles = isFinalCountdown
    ? {
        fontWeight: 700,
        color: "#e14141",
      }
    : {};
  return (
    <ScoreBoxWrapper>
      <ScoreTextWrapper
          animateScore={scoreAnimationPlaying}
          onAnimationEnd={onScoreAnimationEnd}
        >
        <Title level={1} style={{ margin: 0 }}>
          { team1Score !== undefined && team2Score !== undefined &&
            `${team1Score} - ${team2Score}`
          }
        </Title>
      </ScoreTextWrapper>
      {framesRemaining !== -1 && (
        <Text
          style={{
            fontSize: 28,
            margin: 0,
            letterSpacing: 1,
            ...timerStyles,
          }}
        >
          {`${minutesRemaining.toString()}:${secondsRemaining
            .toString()
            .padStart(2, "0")}`}
        </Text>
      )}
      {overtime === true && (
        <Text
          style={{
            fontSize: 21,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {"NEXT GOAL WINS"}
        </Text>
      )}
    </ScoreBoxWrapper>
  );
};
