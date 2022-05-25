import { message, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useTypedSelector } from "../redux/typedHooks";
import { ControlsSummary } from "./ControlsSummary";

const { Text, Title } = Typography;

const CharacterHudWrapper = styled.div`
  height: 100%;

  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  padding: 0 4px 0 6px;

  display: flex;
`;

const SummaryColumn = styled.div`
  width: 180px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const TitleRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const ResourceRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  margin-top: -4px;
`;

const failedAbilityAnimation = keyframes`
  0% {
    background-color: #e63838;
  }
  50% {
    transform: scale(1.1);
  }
`;

const ResourceBadgeContainer = styled.div<{ animateFail: boolean }>`
  position: relative;
  z-index: 2;

  width: 50px;
  height: 36px;
  border-radius: 16px;
  background-color: var(--resource-badge-bg);
  //border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  padding: 0 3px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.animateFail &&
    css`
      animation-name: ${failedAbilityAnimation};
      animation-duration: 0.5s;
    `}
`;

const ResourceBar = styled.div`
  margin-left: -4px;
  flex-grow: 1;
  height: 25px;
  background-color: rgba(150, 150, 150, 1);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  //border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  border-left: none;

  overflow: hidden;
  position: relative;
`;

const ResourceBarFill = styled.div<{ percent: number; color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${(props) => props.percent}%;

  background-color: ${(props) => props.color};
`;

const Divider = styled.div`
  margin: auto 10px;
  width: 1px;
  height: calc(100% - 10px);
  background-color: rgba(0, 0, 0, 0.4);
`;

export type CharacterHudProps = {
  playerIndex: number;
};

export const CharacterHud = ({ playerIndex }: CharacterHudProps) => {
  const {
    color,
    isHost,
    mostRecentFailedAbilityFrame,
    netplayPlayerIndex,
    resourceMeter,
  } = useTypedSelector((state) => ({
    color: state.game.teams[state.game.characters[playerIndex].teamIndex].color,
    isHost: state.netplay.isHost,
    netplayPlayerIndex: state.game.characters[playerIndex].netplayPlayerIndex,
    resourceMeter: state.game.characters[playerIndex].resourceMeter,
    mostRecentFailedAbilityFrame:
      state.game.characters[playerIndex].mostRecentFailedAbilityFrame,
  }));

  const [failedAbilityAnimationPlaying, setFailedAbilityAnimationPlaying] =
    useState(false);

  useEffect(() => {
    if (mostRecentFailedAbilityFrame >= 0) {
      setFailedAbilityAnimationPlaying(true);
    }
  }, [mostRecentFailedAbilityFrame]);

  const onFailedAbilityEnd = useCallback(() => {
    setFailedAbilityAnimationPlaying(false);
  }, []);

  const numberToDisplay = Math.round(resourceMeter);
  const resourceMeterPercent = numberToDisplay;

  const isLocalPlayer = !(
    (isHost && netplayPlayerIndex === 1) ||
    (!isHost && netplayPlayerIndex === 0)
  );

  if (!isLocalPlayer) {
    return null;
  }

  return (
    <CharacterHudWrapper>
      <SummaryColumn>
        <TitleRow>
          <Title level={4} style={{ margin: "0 0 0 4px" }}>
            Player
          </Title>
        </TitleRow>
        <ResourceRow onAnimationEnd={onFailedAbilityEnd}>
          <ResourceBadgeContainer animateFail={failedAbilityAnimationPlaying}>
            <Title level={4} style={{ color, margin: "0 0 -2px -1px" }}>
              {numberToDisplay}
            </Title>
          </ResourceBadgeContainer>
          <ResourceBar>
            <ResourceBarFill percent={resourceMeterPercent} color={color} />
          </ResourceBar>
        </ResourceRow>
      </SummaryColumn>
      <Divider />
      <ControlsSummary playerIndex={playerIndex} />
    </CharacterHudWrapper>
  );
};
