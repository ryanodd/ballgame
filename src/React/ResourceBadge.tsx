import { Typography } from "antd"
import styled, { css, keyframes } from "styled-components"

const { Title } = Typography

const failedAbilityAnimation = keyframes`
  0% {
    background-color: #e63838;
  }
  25% {
  }
  50% {
    transform: scale(1.1);
  }
  75% {
  }
`

const ResourceBadgeContainer = styled.div<{animateFail: boolean}>`
  position: relative;
  z-index: 2;

  width: 50px;
  height: 36px;
  border-radius: 16px;
  background-color: #323232;
  //border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  padding: 0 3px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${props => props.animateFail && css`
    animation-name: ${failedAbilityAnimation};
    animation-duration: 0.5s;
  `}
`

export type ResourceBadgeProps = {
  number: number
  color: string
  animateFail: boolean
}

export const ResourceBadge = ({number, color, animateFail}: ResourceBadgeProps) => {
  return (
    <ResourceBadgeContainer animateFail={animateFail}>
      <Title level={4} style={{color, margin: '0 0 -2px -1px'}}>
        {number}
      </Title>
    </ResourceBadgeContainer>
  )
}
