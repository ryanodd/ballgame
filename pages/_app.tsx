import '../styles/globals.css'
import type { AppProps } from 'next/app'
import configureStore from '../src/redux/configureStore'
import { Provider } from 'react-redux'

export const store = configureStore()

// TODO maybe move this to a game-related page/scope
// require('../src/Game/GameService/SingleClientGame')
require('../src/Game/GameService/netplayjs/myGame')

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
