import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import get from 'lodash/get'

import * as UserAPI from 'api/user'
import { AppThunk } from 'store'

//TODO: The recommended way to fetch api and dispatch result is createAsyncThunk need to
// implement that

export interface UserData {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string
    joinedOn: string
    isActive: boolean
    isVerified: boolean
}

interface UserState {
    userData: UserData
}

const initialState: UserState = {
    userData: {
        id: '',
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        joinedOn: '',
        isActive: false,
        isVerified: false,
    },
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUserData: (state, action: PayloadAction<UserData>) => {
            state.userData = action.payload
        },
    },
})

export const { updateUserData } = userSlice.actions

export const getUser = (): AppThunk => (dispatch, getState) => {
    UserAPI.getUser().then((response) => {
        if (response.ok) {
            const userData: UserData = {
                id: get(response.data, 'id', ''),
                email: get(response.data, 'email', ''),
                username: get(response.data, 'username', ''),
                firstName: get(response.data, 'first_name', ''),
                lastName: get(response.data, 'last_name', ''),
                joinedOn: get(response.data, 'joined_on', ''),
                isActive: get(response.data, 'is_active', false),
                isVerified: get(response.data, 'is_verified', false),
            }
            dispatch(updateUserData(userData))
        }
    })
}

export default userSlice.reducer
