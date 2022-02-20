import { useState } from 'react'
import get from 'lodash/get'

import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Box,
    Grid,
    TextField,
    DialogActions,
    Button,
    Icon,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { generateNewRecoveryCode } from 'api/user'

interface Regenerate2FARecoveryCodeDialogProps {
    open: boolean
    onClose: () => void
    setUser2FARecoveryCodes: (codes: string[]) => void
}

const Regenerate2FARecoveryCodeDialog = ({
    open,
    onClose,
    setUser2FARecoveryCodes,
}: Regenerate2FARecoveryCodeDialogProps) => {
    const [formData, setFormData] = useState({
        password: '',
    })
    const [formError, setFormError] = useState({
        password: '',
    })
    const [codeGenerating, setCodeGenerating] = useState(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value,
        }))
    }

    const handlePasswordSubmit = (
        event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>
    ) => {
        event.preventDefault()
        setCodeGenerating(true)
        generateNewRecoveryCode(formData.password).then((response) => {
            setCodeGenerating(false)
            if (response.ok) {
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
                setFormError({ password: details })
            }
        })
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'center' }}>
                Regenerate Two Factor Code
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
                            <TextField
                                margin="normal"
                                fullWidth
                                type="password"
                                id="password"
                                label="Password"
                                name="password"
                                error={!!formError.password}
                                helperText={formError.password}
                                value={formData.password}
                                onChange={handleInputChange}
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
                    loading={codeGenerating}
                    loadingPosition="end"
                    onClick={handlePasswordSubmit}
                    endIcon={<Icon>arrow_forward</Icon>}>
                    Submit
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export default Regenerate2FARecoveryCodeDialog
