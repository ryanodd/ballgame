import { Button } from "antd"
import { CloseOutlined, DashboardOutlined } from '@ant-design/icons'
import { useState } from "react"
import styled from "styled-components"
import { useTypedSelector } from "../redux/typedHooks"

const NetplayStatsContainer = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
`
const NetplayStatsPanel = styled.div`
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 3px;
  box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.3);

  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  td {
    padding: 0 2px;
  }
`
const NetplayStatsTable = styled.table`
  //table-layout: fixed;
`

export const NetplayStats = () => {
  const { netplayStats } = useTypedSelector((state) => ({
    netplayStats: state.netplay
  }))

  const [menuOpen, setMenuOpen] = useState(false)

  if (netplayStats.ping === null) {
    return null
  }


  
  return (
    <NetplayStatsContainer>
      { menuOpen
        ? (
        <NetplayStatsPanel>
          <Button
            icon={<CloseOutlined />}
            style={{
              
            }}
            onClick={() => setMenuOpen(false)} />
          <NetplayStatsTable>
            <tr>
              <td>Ping</td>
              <td>{netplayStats.ping ? `${netplayStats.ping}ms +/- ${netplayStats.pingStdDev}ms` : null}</td>
            </tr>
            <tr>
              <td>History Length</td>
              <td>{netplayStats.historyLength}</td>
            </tr>
            <tr>
              <td>Largest Future Size</td>
              <td>{netplayStats.largestFutureSize}</td>
            </tr>
            <tr>
              <td>Predicted Frames</td>
              <td>{netplayStats.predictedFrames}</td>
            </tr>
            <tr>
              <td>Stalling</td>
              <td>{netplayStats.stalling.toString()}</td>
            </tr>
          </NetplayStatsTable>
        </NetplayStatsPanel>
      )
      : <Button icon={<DashboardOutlined />} onClick={() => setMenuOpen(true)}/>
    }
    </NetplayStatsContainer>
  )
}
