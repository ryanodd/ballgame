import { Button, Card, Input, message, Radio, Space, Typography } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import styled from "styled-components";
import { SingleClientGame } from "../Game/GameService/SingleClientGame";
import { SET_CURRENT_GAME, SET_UI_DATA } from "../redux/actions";
import { AppState } from "../redux/reducer";
import { useTypedSelector } from "../redux/typedHooks";

const { Text, Title } = Typography;

const ControlsSummaryWrapper = styled.div`
  height: 100%;
  display: flex;
`;

const ControlBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Divider = styled.div`
  width: calc(100% - 4px);
  height: 1px;
  background-color: rgba(0, 0, 0, 0.2);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  > :not(:last-child) {
    margin-right: 3px !important;
  }
`;

const CostBadge = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--resource-badge-bg);
  height: 20px;
  border-radius: 8px;
  padding: 0 5px;
`;

// Mostly for special key names that take too much width
const getDisplayChar = (input: string) => {
  if (input === "ArrowLeft") return "\u2190";
  if (input === "ArrowUp") return "\u2191";
  if (input === "ArrowRight") return "\u2192";
  if (input === "ArrowDown") return "\u2193";
  if (input === "ArrowDown") return "\u2193";
  if (input === " ") return "Space";
  if (input.length === 1) return input.toUpperCase();
  return input;
};

export type ControlsSummaryProps = {
  playerIndex: number;
};

export const ControlsSummary = ({ playerIndex }: ControlsSummaryProps) => {
  const { character, color } = useTypedSelector((state) => ({
    character: state.game.characters[playerIndex],
    color: state.game.teams[state.game.characters[playerIndex].teamIndex].color,
  }));

  const { gamepadIndex, inputConfig } = character;

  const isUsingKeyboardAndMouse = gamepadIndex === -1;

  return (
    <ControlsSummaryWrapper>
      <ControlBox>
        <TitleRow>
          <Title level={5} style={{ margin: 0, padding: "2px 0px" }}>
            Move
          </Title>
        </TitleRow>
        <Divider />
        <Text style={{ transform: "translateY(3px)" }}>
          {getDisplayChar(inputConfig.keyboardMouseInputMapping.buttonUpKey)}
        </Text>
        <Text>
          {getDisplayChar(inputConfig.keyboardMouseInputMapping.buttonLeftKey) +
            " " +
            getDisplayChar(
              inputConfig.keyboardMouseInputMapping.buttonDownKey
            ) +
            " " +
            getDisplayChar(
              inputConfig.keyboardMouseInputMapping.buttonRightKey
            )}
        </Text>
      </ControlBox>
      <ControlBox>
        <TitleRow>
          <Title level={5} style={{ margin: 0, padding: "2px 0" }}>
            Attract
          </Title>
          <CostBadge>
            <Text
              style={{ fontSize: 14, fontWeight: 600, color, marginBottom: -2 }}
            >
              20/sec
            </Text>
          </CostBadge>
        </TitleRow>
        <Divider />
        <Text style={{ fontSize: 20, marginTop: 7 }}>
          {getDisplayChar(inputConfig.keyboardMouseInputMapping.button1Key)}
        </Text>
      </ControlBox>
      <ControlBox>
        <TitleRow>
          <Title level={5} style={{ margin: 0, padding: "2px 0" }}>
            Repel
          </Title>
          <CostBadge>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 600,
                color,
                marginBottom: -2,
              }}
            >
              40
            </Text>
          </CostBadge>
        </TitleRow>
        <Divider />
        <Text style={{ fontSize: 20, marginTop: 7 }}>
          {getDisplayChar(inputConfig.keyboardMouseInputMapping.button2Key)}
        </Text>
      </ControlBox>
    </ControlsSummaryWrapper>
  );
};
