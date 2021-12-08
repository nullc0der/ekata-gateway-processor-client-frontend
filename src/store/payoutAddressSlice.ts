import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// TODO: Removing payout address should remove enabled currency from project

export interface PayoutAddressData {
    id: string
    currency_name: 'bitcoin' | 'monero' | 'dogecoin'
    payout_address: string
}

const initialState: { payoutAddresses: PayoutAddressData[] } = {
    payoutAddresses: [],
}

const payoutAddressSlice = createSlice({
    name: 'payoutAddress',
    initialState,
    reducers: {
        updatePayoutAddresses: (
            state,
            action: PayloadAction<PayoutAddressData[]>
        ) => {
            state.payoutAddresses = action.payload
        },
        addPayoutAddress: (state, action: PayloadAction<PayoutAddressData>) => {
            state.payoutAddresses.push(action.payload)
        },
        editPayoutAddress: (
            state,
            action: PayloadAction<PayoutAddressData>
        ) => {
            state.payoutAddresses = state.payoutAddresses.map((x) =>
                x.id === action.payload.id ? action.payload : x
            )
        },
        deletePayoutAddress: (state, action: PayloadAction<string>) => {
            state.payoutAddresses = state.payoutAddresses.filter(
                (x) => x.id !== action.payload
            )
        },
    },
})

export const {
    updatePayoutAddresses,
    addPayoutAddress,
    editPayoutAddress,
    deletePayoutAddress,
} = payoutAddressSlice.actions
export default payoutAddressSlice.reducer
