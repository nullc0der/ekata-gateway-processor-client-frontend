import { ApisauceInstance, create } from 'apisauce'

import store from 'store'

const apiBase: ApisauceInstance = create({
    baseURL: process.env.REACT_APP_API_ROOT,
})

const jsonAPI = (api: ApisauceInstance) => {
    const auth = store.getState().auth
    api.setHeader('Content-Type', 'application/json')
    if (auth.isAuthenticated) {
        api.setHeader('Authorization', `Bearer ${auth.authToken}`)
    } else {
        api.deleteHeader('Authorization')
    }
    return api
}

const formAPI = (api: ApisauceInstance) => {
    const auth = store.getState().auth
    api.setHeader('Content-Type', 'application/x-www-form-urlencoded')
    if (auth.isAuthenticated) {
        api.setHeader('Authorization', `Bearer ${auth.authToken}`)
    } else {
        api.deleteHeader('Authorization')
    }
    return api
}

export { apiBase, jsonAPI, formAPI }
