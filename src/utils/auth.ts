import store from 'store'

import { deauthenticateUser } from 'store/authSlice'

export const isTokenNotExpired = () => {
    const tokenNotExpired =
        new Date(store.getState().auth.expiresAt) > new Date()
    if (!tokenNotExpired) {
        store.dispatch(deauthenticateUser())
    }
    return tokenNotExpired
}
