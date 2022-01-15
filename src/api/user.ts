import { apiBase, jsonAPI } from './base'

export interface UpdateUserData {
    username?: string
    first_name?: string
    last_name?: string
    current_password?: string
    password?: string
}

export const getUser = () => {
    return jsonAPI(apiBase).get('/users/me')
}

export const updateUser = (data: UpdateUserData) => {
    return jsonAPI(apiBase).patch('/users/me', data)
}

export const getTwoFactorState = () => {
    return jsonAPI(apiBase).get('/client/two-factor')
}

export const createTwoFactor = (password: string) => {
    return jsonAPI(apiBase).post('/client/two-factor', { password })
}

export const enableTwoFactor = (code: string) => {
    return jsonAPI(apiBase).patch('/client/two-factor', { code })
}

export const disableTwoFactor = (password: string) => {
    return jsonAPI(apiBase).delete(
        '/client/two-factor',
        {},
        { data: { password } }
    )
}

export const generateNewRecoveryCode = () => {
    return jsonAPI(apiBase).post('/client/two-factor/get-new-recovery-codes')
}
