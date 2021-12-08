import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PayoutData {
    currency_name: string
    amount: number
    tx_ids: string[]
    payout_processed_for_payments: string[]
    created_on: Date
}

const initialState: { payoutDatas: PayoutData[] } = { payoutDatas: [] }

const payoutSlice = createSlice({
    name: 'payouts',
    initialState,
    reducers: {
        updatePayoutDatas: (state, action: PayloadAction<PayoutData[]>) => {
            state.payoutDatas = action.payload
        },
    },
})

export const { updatePayoutDatas } = payoutSlice.actions
export default payoutSlice.reducer
