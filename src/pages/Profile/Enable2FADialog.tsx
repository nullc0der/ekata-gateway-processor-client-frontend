import React, { useEffect, useState } from 'react'

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
} from '@mui/material'
import QrCode from 'react-qr-code'
import get from 'lodash/get'

import { createTwoFactor, enableTwoFactor } from 'api/user'
import { useAppDispatch } from 'hooks/reduxHooks'
import { updateSnackBar } from 'store/snackBarSlice'
import { update2FAEnabled } from 'store/user2FASlice'

interface Enable2FAProps {
    open: boolean
    onClose: () => void
    setUser2FARecoveryCodes: (codes: string[]) => void
}

const Enable2FADialog = ({
    open,
    onClose,
    setUser2FARecoveryCodes,
}: Enable2FAProps) => {
    const dispatch = useAppDispatch()

    const [provisioningURI, setProvisioningURI] = useState('')
    const [formData, setFormData] = useState({
        code: '',
    })
    const [formError, setFormError] = useState({
        code: '',
    })

    useEffect(() => {
        createTwoFactor().then((response) => {
            if (response.ok) {
                setProvisioningURI(get(response.data, 'provisioning_uri', ''))
            }
        })
    }, [])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value,
        }))
    }

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>
    ) => {
        enableTwoFactor(formData.code).then((response) => {
            if (response.ok) {
                dispatch(
                    updateSnackBar({
                        severity: 'success',
                        message: 'Two factor authentication enabled',
                    })
                )
                dispatch(update2FAEnabled(true))
                setUser2FARecoveryCodes(
                    get(response.data, 'recovery_codes', [])
                )
                onClose()
            }
            if (response.status === 422) {
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
                const details = get(response.data, 'detail', '')
                setFormError({ code: details })
            }
        })
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle sx={{ textAlign: 'center' }}>
                Enable Two Factor Authentication
            </DialogTitle>
            <DialogContent>
                {!!provisioningURI && (
                    <>
                        <Typography variant="body2">
                            Scan the QR code with your authenticator app, like
                            Google Authenticator or Authy, then type in the
                            generated code in below input and submit
                        </Typography>
                        <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                            <QrCode value={provisioningURI} size={256} />
                        </Box>
                        <Box
                            component="form"
                            noValidate
                            sx={{ mt: 1 }}
                            onSubmit={handleSubmit}>
                            <Grid container justifyContent="center">
                                <Grid item xs={8}>
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        id="code"
                                        label="Generated Code"
                                        name="code"
                                        error={!!formError.code}
                                        helperText={formError.code}
                                        value={formData.code}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                        <DialogActions>
                            <Button variant="outlined" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button variant="outlined" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </DialogActions>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default Enable2FADialog
