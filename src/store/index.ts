import { combineReducers } from 'redux'

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authReducer from 'store/authSlice'
import uiReducer from 'store/uiSlice'
import userReducer from 'store/userSlice'
import snackBarReducer from 'store/snackBarSlice'
import payoutAddressReducer from 'store/payoutAddressSlice'
import projectReducer from 'store/projectsSlice'
import projectPaymentsReducer from 'store/projectPaymentsSlice'
import payoutReducer from 'store/payoutSlice'
import user2FAReducer from 'store/user2FASlice'

const rootReducer = combineReducers({
    auth: persistReducer({ key: 'auth', storage }, authReducer),
    ui: persistReducer({ key: 'ui', storage }, uiReducer),
    user: userReducer,
    snackBar: snackBarReducer,
    payoutAddress: payoutAddressReducer,
    project: projectReducer,
    projectPayments: projectPaymentsReducer,
    payouts: payoutReducer,
    user2FA: user2FAReducer,
})

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
})

export let persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>
export default store
