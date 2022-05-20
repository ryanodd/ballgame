import { Button, Card } from "antd"
import { useCallback } from "react"
import { useSelector, useStore } from "react-redux"
import styled from "styled-components"
import { AppState } from "../redux/reducer"
import { useTypedSelector } from "../redux/typedHooks"

const NetplayMenuWrapper = styled.div`
  position: absolute;
  bottom: 5px;
  left: 5px;
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
      window.navigator.clipboard.writeText(joinUrl)
    }
  }, [joinUrl])

  return (
    <NetplayMenuWrapper>
      <Card>
        <NetplayMenuColumn>
        <Button onClick={copyToClipboard}>
          Copy Player 2 Link to Clipboard
        </Button>
        </NetplayMenuColumn>
      </Card>
    </NetplayMenuWrapper>
  )
}
