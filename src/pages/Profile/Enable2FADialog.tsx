import React, { useState } from 'react'

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
    Icon,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import QRCode from 'qrcode.react'
import get from 'lodash/get'

import EnhancedPasswordField from 'components/EnhancedPasswordField'
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
        password: '',
    })
    const [formError, setFormError] = useState({
        code: '',
        password: '',
    })
    const [enablingTwoFactor, setEnablingTwoFactor] = useState(false)

    const handleInputChange = (id: string, value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }))
        const hasError = get(formError, id, '').length
        if (hasError) {
            setFormError((prevState) => ({
                ...prevState,
                [id]: '',
            }))
        }
    }

    const handlePasswordSubmit = (
        event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>
    ) => {
        event.preventDefault()
        setEnablingTwoFactor(true)
        createTwoFactor(formData.password).then((response) => {
            setEnablingTwoFactor(false)
            if (response.ok) {
                setProvisioningURI(get(response.data, 'provisioning_uri', ''))
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
                setFormError({ code: '', password: details })
            }
        })
    }

    const handleCodeSubmit = (
        event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>
    ) => {
        event.preventDefault()
        setEnablingTwoFactor(true)
        enableTwoFactor(formData.code).then((response) => {
            setEnablingTwoFactor(false)
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
                setFormError({ code: details, password: '' })
            }
        })
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle sx={{ textAlign: 'center' }}>
                Enable Two Factor Authentication
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
                {provisioningURI ? (
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
                            <QRCode
                                value={provisioningURI}
                                size={256}
                                includeMargin
                            />
                        </Box>
                        <Box
                            component="form"
                            noValidate
                            sx={{ mt: 1 }}
                            onSubmit={handleCodeSubmit}>
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
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            handleInputChange(
                                                event.target.id,
                                                event.target.value
                                            )
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="body2">
                            Verify your password first
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            sx={{ mt: 1 }}
                            onSubmit={handlePasswordSubmit}>
                            <Grid container justifyContent="center">
                                <Grid item xs={12}>
                                    <EnhancedPasswordField
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        id="password"
                                        error={!!formError.password}
                                        helperText={formError.password}
                                        showPasswordStrength={false}
                                        onChange={(id: string, value: string) =>
                                            handleInputChange(id, value)
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <LoadingButton
                    variant="outlined"
                    onClick={
                        provisioningURI
                            ? handleCodeSubmit
                            : handlePasswordSubmit
                    }
                    loading={enablingTwoFactor}
                    loadingPosition="end"
                    endIcon={<Icon>arrow_forward</Icon>}>
                    {provisioningURI ? 'Verify Code' : 'Verify Password'}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export default Enable2FADialog
