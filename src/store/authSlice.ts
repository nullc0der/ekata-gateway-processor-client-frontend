import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    isAuthenticated: boolean
    authToken: string
    expiresAt: number
}

interface AuthenticateUserPayload {
    authToken: string
    expiresAt: number
}

const initialState: AuthState = {
    isAuthenticated: false,
    authToken: '',
    expiresAt: 0,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authenticateUser: (
            state,
            action: PayloadAction<AuthenticateUserPayload>
        ) => {
            state.isAuthenticated = true
            state.authToken = action.payload.authToken
            state.expiresAt = action.payload.expiresAt
        },
        deauthenticateUser: (state) => {
            state.isAuthenticated = false
            state.authToken = ''
            state.expiresAt = 0
        },
    },
})

export const { authenticateUser, deauthenticateUser } = authSlice.actions

export default authSlice.reducer
