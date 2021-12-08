import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SnackBarState {
    severity: 'success' | 'info' | 'warning' | 'error'
    message: string
}

const initialState: SnackBarState = {
    severity: 'success',
    message: '',
}

const snackBarSlice = createSlice({
    name: 'snackBar',
    initialState,
    reducers: {
        updateSnackBar: (state, action: PayloadAction<SnackBarState>) => {
            state.message = action.payload.message
            state.severity = action.payload.severity
        },
    },
})

export const { updateSnackBar } = snackBarSlice.actions
export default snackBarSlice.reducer
