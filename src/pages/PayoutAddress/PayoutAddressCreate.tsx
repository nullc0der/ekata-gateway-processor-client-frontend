import React, { useState } from 'react'
import {
    Box,
    Divider,
    Typography,
    TextField,
    MenuItem,
    Alert,
    IconButton,
    Icon,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import get from 'lodash/get'

import BasicCard from 'components/BasicCard'
import { createPayoutAddress, PayoutAddressFormData } from 'api/payoutAddress'
import { ALLOWED_CURRENCY } from 'appconstants'
import { useAppDispatch } from 'hooks/reduxHooks'
import { addPayoutAddress } from 'store/payoutAddressSlice'
import { updateSnackBar } from 'store/snackBarSlice'
import { PayoutAddressData } from 'store/payoutAddressSlice'

interface PayoutAddressCreateProps {
    initialAddress?: boolean
    toggleCreateNewForm?: () => void
    showPayoutAddressList?: () => void
    setSelectedPayoutAddress?: (payoutAddress: PayoutAddressData) => void
}

const initialFormState: PayoutAddressFormData = {
    currency_name: 'bitcoin',
    payout_address: '',
}

const initialFormError = {
    currency_name: '',
    payout_address: '',
}

const PayoutAddressCreate = ({
    initialAddress,
    toggleCreateNewForm,
    showPayoutAddressList,
    setSelectedPayoutAddress,
}: PayoutAddressCreateProps) => {
    const dispatch = useAppDispatch()
    const [formData, setFormData] =
        useState<PayoutAddressFormData>(initialFormState)
    const [formError, setFormError] = useState(initialFormError)
    const [createError, setCreateError] = useState('')
    const [addressCreating, setAddressCreating] = useState(false)

    const handleInputChange = (
        id: string,
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prevState) => ({
            ...prevState,
            [id]: event.target.value,
        }))
        const hasError = get(formError, id, '').length
        if (hasError) {
            setFormError((prevState) => ({
                ...prevState,
                [id]: '',
            }))
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setAddressCreating(true)
        createPayoutAddress(formData).then((response) => {
            setAddressCreating(false)
            if (response.ok) {
                setCreateError('')
                setFormError(initialFormError)
                if (response.data) {
                    dispatch(addPayoutAddress(response.data))
                    dispatch(
                        updateSnackBar({
                            severity: 'success',
                            message: 'Payout address added',
                        })
                    )
                    if (
                        !initialAddress &&
                        typeof toggleCreateNewForm === 'function'
                    ) {
                        toggleCreateNewForm()
                        typeof setSelectedPayoutAddress === 'function' &&
                            setSelectedPayoutAddress(response.data)
                    }
                    if (typeof showPayoutAddressList === 'function') {
                        showPayoutAddressList()
                        typeof setSelectedPayoutAddress === 'function' &&
                            setSelectedPayoutAddress(response.data)
                    }
                }
            } else {
                if (response.status === 422) {
                    setCreateError('')
                    const details = get(response.data, 'detail', {})
                    let formErrors = { ...formError }
                    for (const detail of details) {
                        formErrors = {
                            ...formErrors,
                            [detail.loc[1]]: detail.msg,
                        }
                    }
                    setFormError(formErrors)
                }
                if (response.status === 400) {
                    setCreateError('')
                    setFormError((prevState) => ({
                        ...prevState,
                        currency_name: get(response.data, 'detail', ''),
                    }))
                }
            }
        })
    }

    return (
        <BasicCard>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    px: 4,
                    position: 'relative',
                }}>
                {initialAddress ? (
                    <Typography variant="h6" textAlign="center">
                        It seems you have not added a payout address yet, lets
                        add one
                    </Typography>
                ) : (
                    <>
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '-20px',
                                top: '-10px',
                                display: { sm: 'none' },
                            }}>
                            <IconButton onClick={showPayoutAddressList}>
                                <Icon>arrow_back</Icon>
                            </IconButton>
                        </Box>
                        <Typography variant="h6" textAlign="center">
                            Add a payout address
                        </Typography>
                    </>
                )}
                <Divider
                    sx={{
                        mt: 2,
                        mx: 'auto',
                        width: '24px',
                        borderWidth: '3px',
                    }}
                />
                <Box
                    component="form"
                    noValidate
                    sx={{ mt: 1 }}
                    onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="currency_name"
                        select
                        label="Currency"
                        value={formData.currency_name}
                        error={!!formError.currency_name}
                        helperText={formError.currency_name}
                        onChange={(e) => handleInputChange('currency_name', e)}>
                        {ALLOWED_CURRENCY.map((x, i) => (
                            <MenuItem key={i} value={x.toLowerCase()}>
                                {x.toLowerCase()}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="payout_address"
                        label="Address"
                        name="payoutAddress"
                        value={formData.payout_address}
                        error={!!formError.payout_address}
                        helperText={formError.payout_address}
                        onChange={(e) => handleInputChange('payout_address', e)}
                    />
                    {!!createError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {createError}
                        </Alert>
                    )}
                    <LoadingButton
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{ my: 2 }}
                        disableElevation
                        loading={addressCreating}
                        loadingPosition="end"
                        endIcon={<Icon>arrow_forward</Icon>}>
                        Submit
                    </LoadingButton>
                </Box>
            </Box>
        </BasicCard>
    )
}

export default PayoutAddressCreate
