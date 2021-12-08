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
}

interface DeletePayoutAddressPopupProps {
    open: boolean
    toggleDeleteDialog: () => void
    deletePayoutAddress: () => void
}

const DeletePayoutAddressPopup = ({
    open,
    toggleDeleteDialog,
    deletePayoutAddress,
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
                <Button
                    variant="outlined"
                    color="error"
                    onClick={deletePayoutAddress}
                    startIcon={<Icon>delete</Icon>}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const PayoutAddressUpdate = ({
    payoutAddress,
    showPayoutAddressList,
}: PayoutAddressUpdateProps) => {
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState('')
    const [formError, setFormError] = useState('')
    const [updateError, setUpdateError] = useState('')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    useEffect(() => {
        setFormData(payoutAddress.payout_address)
    }, [payoutAddress])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(event.target.value)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        updatePayoutAddress(payoutAddress.id, {
            payout_address: formData,
            currency_name: payoutAddress.currency_name,
        }).then((response) => {
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
        deletePayoutAddress(payoutAddress.id).then((response) => {
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
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            startIcon={<Icon>check</Icon>}>
                            Update
                        </Button>
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
            />
        </BasicCard>
    )
}

export default PayoutAddressUpdate
