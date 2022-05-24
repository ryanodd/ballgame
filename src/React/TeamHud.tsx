import { Button, Card, Input, message, Radio, Space, Typography } from "antd"
import { useCallback } from "react"
import { useDispatch, useSelector, useStore } from "react-redux"
import styled from "styled-components"
import { SingleClientGame } from "../Game/GameService/SingleClientGame"
import { SET_CURRENT_GAME, SET_UI_DATA } from "../redux/actions"
import { AppState } from "../redux/reducer"
import { useTypedSelector } from "../redux/typedHooks"
import { CharacterHud } from "./CharacterHud"

const { Text, Title } = Typography

const TeamHudWrapper = styled.div`
  height: 100%;

  display: flex;
  align-items: stretch;
  justify-content: center;
`

export type TeamHudProps = {
  teamIndex: number
}

export const TeamHud = ({teamIndex}: TeamHudProps) => {
  const { characters, teams } = useTypedSelector((state) => {
    return {
      characters: state.game.characters,
      teams: state.game.teams,
    }
  })

  const charactersOnThisTeam = characters.filter((character) => {
    return (character.teamIndex === teamIndex)
  })

  return (
    <TeamHudWrapper>
      {
        charactersOnThisTeam.map((character, i) => {
          return (
            <CharacterHud
              key={i}
              playerIndex={character.playerIndex}
            />
          )
        })
      }
    </TeamHudWrapper>
  )
}
