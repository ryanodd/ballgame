import { Button, Card, Input, message, Radio, Space, Typography } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import styled from "styled-components";
import { SingleClientGame } from "../Game/GameService/SingleClientGame";
import { SET_CURRENT_GAME, SET_UI_DATA } from "../redux/actions";
import { AppState } from "../redux/reducer";
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

export const ScoreBox = () => {
  const { framesRemaining, overtime, teams } = useTypedSelector((state) => {
    return {
      framesRemaining: state.game.framesRemaining,
      overtime: state.game.overtime,
      teams: state.game.teams,
    };
  });

  let secondsRemaining = Math.ceil((framesRemaining ?? 0) / 60);
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
      <Title level={2} style={{ margin: 0 }}>
        {teams[0] && teams[1] && `${teams[0]?.score} - ${teams[1]?.score}`}
      </Title>
      {framesRemaining !== null && (
        <Text
          style={{
            fontSize: 22,
            margin: 0,
            ...timerStyles,
          }}
        >
          {`${minutesRemaining.toString()}:${secondsRemaining
            .toString()
            .padStart(2, "0")}`}
        </Text>
      )}
      {overtime === true && (
        <Text style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
          {"NEXT GOAL WINS"}
        </Text>
      )}
    </ScoreBoxWrapper>
  );
};
