import { Button, Card, Input, message, Radio, Space, Typography } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import styled from "styled-components";
import { CharacterType } from "../Game/GameService/Player/CharacterType";
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

const titleStyle = { margin: 0, padding: "2px 0px" }

const singleButtonControlTextStyle = { fontSize: 20, marginTop: 7 }

const costBadgeTextStyle = {
  fontSize: 14,
  fontWeight: 600,
  marginBottom: -1,
}

export const ControlsSummary = ({ playerIndex }: ControlsSummaryProps) => {
  const { character, color } = useTypedSelector((state) => ({
    character: state.game.characters[playerIndex],
    color: state.game.teams[state.game.characters[playerIndex].teamIndex].color,
  }));

  const { gamepadIndex, inputConfig } = character;

  const isUsingKeyboardAndMouse = gamepadIndex === -1;

  return (
    <ControlsSummaryWrapper>
      {
        character.characterType === CharacterType.Pulse && (
          <>
            <ControlBox>
              <TitleRow>
                <Title level={5} style={titleStyle}>
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
                <Title level={5} style={titleStyle}>
                  Attract
                </Title>
                <CostBadge>
                  <Text
                    style={{
                      ...costBadgeTextStyle, color
                    }}
                  >
                    20/sec
                  </Text>
                </CostBadge>
              </TitleRow>
              <Divider />
              <Text style={singleButtonControlTextStyle}>
                {getDisplayChar(inputConfig.keyboardMouseInputMapping.button1Key)}
              </Text>
            </ControlBox>
            <ControlBox>
              <TitleRow>
                <Title level={5} style={titleStyle}>
                  Repel
                </Title>
                <CostBadge>
                  <Text
                    style={{
                      ...costBadgeTextStyle,
                      color,
                    }}
                  >
                    25
                  </Text>
                </CostBadge>
              </TitleRow>
              <Divider />
              <Text style={singleButtonControlTextStyle}>
                {getDisplayChar(inputConfig.keyboardMouseInputMapping.button2Key)}
              </Text>
            </ControlBox>
          </>
        )
      }
      {
        character.characterType === CharacterType.Ship && (
          <>
            <ControlBox>
              <TitleRow>
                <Title level={5} style={titleStyle}>
                  Rotate
                </Title>
              </TitleRow>
              <Divider />
              <Text style={singleButtonControlTextStyle}>
                {
                  getDisplayChar(inputConfig.keyboardMouseInputMapping.buttonLeftKey) +
                  " " +
                  getDisplayChar(
                    inputConfig.keyboardMouseInputMapping.buttonRightKey
                  )
                }
              </Text>
            </ControlBox>
            <ControlBox>
              <TitleRow>
                <Title level={5} style={titleStyle}>
                  Thrust
                </Title>
                <CostBadge>
                  <Text
                    style={{
                      ...costBadgeTextStyle, color
                    }}
                  >
                    8/sec
                  </Text>
                </CostBadge>
              </TitleRow>
              <Divider />
              <Text style={singleButtonControlTextStyle}>
                {getDisplayChar(inputConfig.keyboardMouseInputMapping.buttonUpKey)}
              </Text>
            </ControlBox>
            <ControlBox>
              <TitleRow>
                <Title level={5} style={titleStyle}>
                  Shoot
                </Title>
                <CostBadge>
                  <Text
                    style={{
                      ...costBadgeTextStyle,
                      color,
                    }}
                  >
                    8
                  </Text>
                </CostBadge>
              </TitleRow>
              <Divider />
              <Text style={singleButtonControlTextStyle}>
                {getDisplayChar(inputConfig.keyboardMouseInputMapping.button1Key)}
              </Text>
            </ControlBox>
          </>
        )
      }
    </ControlsSummaryWrapper>
  );
};
