import React, { useEffect, useState } from 'react'
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Stack,
    Icon,
    IconButton,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import get from 'lodash/get'

import { PayoutAddressData } from 'store/payoutAddressSlice'
import BasicCard from 'components/BasicCard'
import { updatePayoutAddress, deletePayoutAddress } from 'api/payoutAddress'
import { useAppDispatch } from 'hooks/reduxHooks'
import {
    editPayoutAddress,
    deletePayoutAddress as deletePayoutAddressAction,
} from 'store/payoutAddressSlice'
import { updateSnackBar } from 'store/snackBarSlice'

interface PayoutAddressUpdateProps {
    payoutAddress: PayoutAddressData
    showPayoutAddressList: () => void
    setSelectedPayoutAddress?: (payoutAddress?: PayoutAddressData) => void
}

interface DeletePayoutAddressPopupProps {
    open: boolean
    deletingPayoutAddress: boolean
    toggleDeleteDialog: () => void
    deletePayoutAddress: () => void
}

const DeletePayoutAddressPopup = ({
    open,
    toggleDeleteDialog,
    deletePayoutAddress,
    deletingPayoutAddress,
}: DeletePayoutAddressPopupProps) => {
    return (
        <Dialog open={open} onClose={toggleDeleteDialog}>
            <DialogContent>
                <DialogContentText>
                    Deleting this payout address will disable this currency in
                    all project, do you want to proceed ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={toggleDeleteDialog}>
                    Cancel
                </Button>
                <LoadingButton
                    variant="outlined"
                    color="error"
                    onClick={deletePayoutAddress}
                    loading={deletingPayoutAddress}
                    loadingPosition="end"
                    endIcon={<Icon>delete</Icon>}>
                    Delete
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

const PayoutAddressUpdate = ({
    payoutAddress,
    showPayoutAddressList,
    setSelectedPayoutAddress,
}: PayoutAddressUpdateProps) => {
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState('')
    const [formError, setFormError] = useState('')
    const [updateError, setUpdateError] = useState('')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [updatingPayoutAddress, setUpdatingPayoutAddress] = useState(false)
    const [deletingPayoutAddress, setDeletingPayoutAddress] = useState(false)

    useEffect(() => {
        setFormData(payoutAddress.payout_address)
    }, [payoutAddress])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(event.target.value)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setUpdatingPayoutAddress(true)
        updatePayoutAddress(payoutAddress.id, {
            payout_address: formData,
            currency_name: payoutAddress.currency_name,
        }).then((response) => {
            setUpdatingPayoutAddress(false)
            if (response.ok) {
                setFormError('')
                setUpdateError('')
                if (response.data) {
                    dispatch(editPayoutAddress(response.data))
                    dispatch(
                        updateSnackBar({
                            severity: 'success',
                            message: 'Payout address updated',
                        })
                    )
                    showPayoutAddressList()
                }
            } else {
                if (response.status === 422) {
                    setUpdateError('')
                    const details = get(response.data, 'detail', [])
                    if (details.length) {
                        setFormError(get(details[0], 'msg', ''))
                    }
                }
            }
        })
    }

    const handleDelete = () => {
        setDeletingPayoutAddress(true)
        deletePayoutAddress(payoutAddress.id).then((response) => {
            setDeletingPayoutAddress(false)
            if (response.ok) {
                toggleDeleteDialog()
                dispatch(deletePayoutAddressAction(payoutAddress.id))
                dispatch(
                    updateSnackBar({
                        severity: 'success',
                        message: 'Payout Address deleted',
                    })
                )
                showPayoutAddressList()
                typeof setSelectedPayoutAddress === 'function' &&
                    setSelectedPayoutAddress(undefined)
            }
        })
    }

    const toggleDeleteDialog = () => {
        setDeleteDialogOpen(!deleteDialogOpen)
    }

    return (
        <BasicCard>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}>
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
                <Typography
                    variant="body1"
                    textAlign="center"
                    sx={{ textTransform: 'capitalize' }}>
                    Update payout address for {payoutAddress.currency_name}
                </Typography>
                <Box
                    component="form"
                    noValidate
                    sx={{ mt: 1 }}
                    onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="payout_address"
                        label="Address"
                        name="payoutAddress"
                        value={formData}
                        error={!!formError}
                        helperText={formError}
                        onChange={handleInputChange}
                    />
                    {!!updateError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {updateError}
                        </Alert>
                    )}
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        sx={{ my: 2 }}
                        spacing={2}>
                        <LoadingButton
                            variant="contained"
                            type="submit"
                            disableElevation
                            loading={updatingPayoutAddress}
                            loadingPosition="end"
                            endIcon={<Icon>arrow_forward</Icon>}>
                            Update
                        </LoadingButton>
                        <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={toggleDeleteDialog}>
                            <Icon>delete</Icon>
                        </IconButton>
                    </Stack>
                </Box>
            </Box>
            <DeletePayoutAddressPopup
                open={deleteDialogOpen}
                deletePayoutAddress={handleDelete}
                toggleDeleteDialog={toggleDeleteDialog}
                deletingPayoutAddress={deletingPayoutAddress}
            />
        </BasicCard>
    )
}

export default PayoutAddressUpdate
