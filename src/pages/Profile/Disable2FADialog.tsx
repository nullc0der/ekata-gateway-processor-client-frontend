import { useState } from 'react'
import get from 'lodash/get'

import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Grid,
    Typography,
    Box,
    Button,
    Icon,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

import EnhancedPasswordField from 'components/EnhancedPasswordField'
import { disableTwoFactor } from 'api/user'
import { useAppDispatch } from 'hooks/reduxHooks'
import { updateSnackBar } from 'store/snackBarSlice'
import { update2FAEnabled } from 'store/user2FASlice'

interface Disable2FADialogProps {
    open: boolean
    onClose: () => void
}

const Disable2FADialog = ({ open, onClose }: Disable2FADialogProps) => {
    const dispatch = useAppDispatch()

    const [formData, setFormData] = useState({
        password: '',
    })
    const [formError, setFormError] = useState({
        password: '',
    })
    const [disablingTwoFactor, setDisablingTwoFactor] = useState(false)

    const handleInputChange = (id: string, value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }))
    }

    const handlePasswordSubmit = (
        event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>
    ) => {
        event.preventDefault()
        setDisablingTwoFactor(true)
        disableTwoFactor(formData.password).then((response) => {
            setDisablingTwoFactor(false)
            if (response.ok) {
                onClose()
                dispatch(update2FAEnabled(false))
                dispatch(
                    updateSnackBar({
                        severity: 'warning',
                        message: 'Two factor authentication disabled',
                    })
                )
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
                setFormError({ password: details })
            }
        })
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'center' }}>
                Disable Two Factor Authentication
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
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
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <LoadingButton
                    variant="outlined"
                    onClick={handlePasswordSubmit}
                    loading={disablingTwoFactor}
                    loadingPosition="end"
                    endIcon={<Icon>arrow_forward</Icon>}>
                    Submit
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export default Disable2FADialog
