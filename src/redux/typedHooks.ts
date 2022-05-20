import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { Dispatch } from "redux"
import { AppState } from "./reducer"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useTypedDispatch = (): Dispatch => useDispatch<Dispatch>() // not sure if this one is right
export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector
