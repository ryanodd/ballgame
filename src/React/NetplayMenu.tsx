import { Button, Card, Input, message, Space, Typography } from "antd"
import { useCallback } from "react"
import { useSelector, useStore } from "react-redux"
import styled from "styled-components"
import { AppState } from "../redux/reducer"
import { useTypedSelector } from "../redux/typedHooks"

const { Text, Title } = Typography

const NetplayMenuWrapper = styled.div`
  /* position: absolute;
  bottom: 5px;
  left: 5px; */
`

const NetplayMenuColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  :not(:last-child) {
    margin-bottom: 8px;
  }
  padding: 4px;
`

export const NetplayMenu = () => {

  const { joinUrl } = useTypedSelector(({netplay}) => {
    return {
      joinUrl: netplay.joinUrl
    }
  })

  const copyToClipboard = useCallback(() => {
    if (joinUrl) {
      message.success('Copied to clipboard.');
      window.navigator.clipboard.writeText(joinUrl)
    }

  }, [joinUrl])

  return (
    <NetplayMenuWrapper>
      <Card style={{overflowX: 'auto', overflowY: 'hidden'}}>
        {/* <Space direction="vertical" size="small"> */}
          <Title level={2}>
            Play Online
          </Title>
          <Space direction="vertical" size="small">
            <Text>
              The game will begin when someone else enters this URL.
            </Text>
            <Space>
              {/* <Title code level={4}>
                {joinUrl}
              </Title> */}
              <Input size="large" value={joinUrl ?? ''} style={{width: 550}} />
              <Button size="large" type="primary" onClick={copyToClipboard}>
                Copy
              </Button>
            </Space>
            
          </Space>
        {/* </Space> */}
      </Card>
    </NetplayMenuWrapper>
  )
}
