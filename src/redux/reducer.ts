
import { SET_ERROR, Action, SET_USING_KEYBOARD} from './actions'

export type AppState = {
  error: string | null
  usingKeyboard: boolean
}

export const initialState: AppState = {
  error: null,
  usingKeyboard: false,
}

// Use the initialState as a default value
export default function appReducer(state = initialState, action: Action): AppState {
  switch (action.type) {
    case SET_ERROR: {
      return { ...state, error: action.payload }
    }
    case SET_USING_KEYBOARD: {
      return { ...state, usingKeyboard: action.payload }
    }
    default:
      return state
  }
}
