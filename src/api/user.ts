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
