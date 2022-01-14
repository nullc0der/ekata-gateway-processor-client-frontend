import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    isEnabled: false,
}

const user2FASlice = createSlice({
    name: 'user2FA',
    initialState,
    reducers: {
        update2FAEnabled: (state, action: PayloadAction<boolean>) => {
            state.isEnabled = action.payload
        },
    },
})

export const { update2FAEnabled } = user2FASlice.actions

export default user2FASlice.reducer
