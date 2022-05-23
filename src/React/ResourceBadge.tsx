import { Typography } from "antd"
import styled from "styled-components"

const { Title } = Typography

const ResourceBadgeContainer = styled.div`
  position: relative;
  z-index: 2;

  width: 50px;
  height: 36px;
  border-radius: 16px;
  background-color: #dea3a3;
  //border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  padding: 0 3px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export type ResourceBadgeProps = {
  number: number
}

export const ResourceBadge = ({number}: ResourceBadgeProps) => {
  return (
    <ResourceBadgeContainer>
      <Title level={4} style={{margin: '0 0 -2px -1px'}}>
        {number}
      </Title>
    </ResourceBadgeContainer>
  )
}
