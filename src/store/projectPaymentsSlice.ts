import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PaymentData {
    payment_id: string
    currency_name: string
    amount_requested: number
    amount_received?: number
    tx_ids?: string[]
    created_on?: Date
    status: string
    form_id: string
}

export interface ProjectPayments {
    projectPayments: { payments: PaymentData[]; totalPayments: number }
}

const initialState: ProjectPayments = {
    projectPayments: { payments: [], totalPayments: 0 },
}

const projectPaymentsSlice = createSlice({
    name: 'projectPayments',
    initialState,
    reducers: {
        updateProjectPayments: (
            state,
            action: PayloadAction<{
                projectID: string
                paymentDatas: PaymentData[]
                totalPayments?: number
            }>
        ) => {
            state.projectPayments = {
                payments: action.payload.paymentDatas,
                totalPayments: action.payload.totalPayments
                    ? action.payload.totalPayments
                    : state.projectPayments.totalPayments,
            }
        },
    },
})

export const { updateProjectPayments } = projectPaymentsSlice.actions
export default projectPaymentsSlice.reducer
