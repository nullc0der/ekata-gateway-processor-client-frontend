import { apiBase, jsonAPI } from './base'

import { PayoutData } from 'store/payoutSlice'

export const getPayouts = () => {
    return jsonAPI(apiBase).get<PayoutData[]>('/client/payouts')
}
