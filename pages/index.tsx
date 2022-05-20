import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

//@ts-ignore no idea what this error means.
const GamePageWithNoSSR = dynamic(() => import('../src/React/GamePage'), {
  ssr: false
})

const Home: NextPage = () => {
  return (
    <GamePageWithNoSSR />
  )
}

export default Home
