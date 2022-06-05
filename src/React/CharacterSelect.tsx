import { Button, Radio, RadioChangeEvent, Typography } from "antd"
import { useCallback } from "react"
import styled from "styled-components"
import { CharacterType } from "../Game/GameService/Player/CharacterType"
import { CLIENT_SWITCH_CHARACTERS, SET_UI_DATA } from "../redux/actions"
import { useTypedDispatch, useTypedSelector } from "../redux/typedHooks"

const { Text } = Typography

const CharacterSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export type CharacterSelectProps = {
  playerIndex: number
}

export const CharacterSelect = ({playerIndex}: CharacterSelectProps) => {
  const {gameClass, selectedCharacterType} = useTypedSelector((state) => {
    return {
      gameClass: state.gameClass,
      selectedCharacterType: state.gameClass?.players[playerIndex].characterType
    }
  })
  const dispatch = useTypedDispatch()
  const onChange = useCallback((e: RadioChangeEvent) => {
    
    dispatch({
      type: CLIENT_SWITCH_CHARACTERS,
      payload: {
        playerIndex,
        characterType: e.target.value,
      }
    })

    dispatch({
      type: SET_UI_DATA,
      payload: {
        characterSelectPopoverOpenPlayerIndex: null,
      }
    })
  }, [])

  return (
    <CharacterSelectContainer>
      <Radio.Group defaultValue={selectedCharacterType} buttonStyle="solid" onChange={onChange}>
        <Radio.Button value={CharacterType.Pulse}>Pulse</Radio.Button>
        <Radio.Button value={CharacterType.Ship}>Ship</Radio.Button>
      </Radio.Group>
      <Text
        style={{
          marginTop: 8,
        }}
      >
        This will take effect after a goal  
      </Text>
    </CharacterSelectContainer>
  )
}
