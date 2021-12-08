import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
    preferredMode: 'dark' | 'light' | 'system'
}

const initialState: UIState = {
    preferredMode: 'system',
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        changePreferredMode: (
            state,
            action: PayloadAction<'dark' | 'light' | 'system'>
        ) => {
            state.preferredMode = action.payload
        },
    },
})

export default uiSlice.reducer
export const { changePreferredMode } = uiSlice.actions
