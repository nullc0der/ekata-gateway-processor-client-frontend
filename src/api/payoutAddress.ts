import { apiBase, jsonAPI } from './base'

import { PayoutAddressData } from 'store/payoutAddressSlice'

export interface PayoutAddressFormData {
    currency_name: 'bitcoin' | 'monero' | 'dogecoin'
    payout_address: string
}

export const getPayoutAddresses = () => {
    return jsonAPI(apiBase).get<PayoutAddressData[]>('/client/payout-address')
}

export const createPayoutAddress = (data: PayoutAddressFormData) => {
    return jsonAPI(apiBase).post<PayoutAddressData>(
        '/client/payout-address',
        data
    )
}

export const updatePayoutAddress = (
    payoutAddressID: string,
    data: PayoutAddressFormData
) => {
    return jsonAPI(apiBase).patch<PayoutAddressData>(
        `/client/payout-address/${payoutAddressID}`,
        data
    )
}

export const deletePayoutAddress = (payoutAddressID: string) => {
    return jsonAPI(apiBase).delete(`/client/payout-address/${payoutAddressID}`)
}
