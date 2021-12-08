import qs from 'qs'

import { apiBase, formAPI, jsonAPI } from './base'

export interface RegisterData {
    email: string
    password: string
    username: string
    first_name: string
    last_name: string
}

export const login = (username: string, password: string) => {
    return formAPI(apiBase).post(
        '/auth/jwt/login',
        qs.stringify({ username, password })
    )
}

export const register = (data: RegisterData) => {
    return jsonAPI(apiBase).post('/auth/register', data)
}

export const verifyEmail = (token: string) => {
    return jsonAPI(apiBase).post('/auth/verify', { token })
}

export const forgotPassword = (email: string) => {
    return jsonAPI(apiBase).post('/auth/forgot-password', { email })
}

export const resetPassword = (token: string, password: string) => {
    return jsonAPI(apiBase).post('/auth/reset-password', { token, password })
}
