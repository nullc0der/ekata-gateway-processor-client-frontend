import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'

import get from 'lodash/get'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import { LoadingButton } from '@mui/lab'
import { useMediaQuery, useTheme, Collapse, Icon } from '@mui/material'
import { TransitionGroup } from 'react-transition-group'

import Logo from 'assets/image/logo.svg'
import { resetPassword } from 'api/auth'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [token, setToken] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [resetPasswordError, setResetPasswordError] = useState('')
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false)
    const [resetAPICalling, setResetAPICalling] = useState(false)
    const theme = useTheme()
    const isSM = useMediaQuery(theme.breakpoints.down('md'))
    const isXS = useMediaQuery(theme.breakpoints.down('sm'))

    const params = useParams()

    useEffect(() => {
        if (params.token !== token) {
            setToken(params.token || '')
        }
    }, [params.token, token])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setResetAPICalling(true)
        resetPassword(token, password).then((response) => {
            setResetAPICalling(false)
            if (response.ok) {
                setPasswordError('')
                setResetPasswordError('')
                setResetPasswordSuccess(true)
            } else {
                if (response.status === 400) {
                    const detail = get(response.data, 'detail', {})
                    if (detail === 'RESET_PASSWORD_BAD_TOKEN') {
                        setResetPasswordError(
                            'Please check if you copied the URL correctly'
                        )
                    }
                    if (detail.code === 'RESET_PASSWORD_INVALID_PASSWORD') {
                        setPasswordError(detail.reason)
                    }
                }
                if (
                    response.problem === 'NETWORK_ERROR' ||
                    response.problem === 'CONNECTION_ERROR' ||
                    response.problem === 'TIMEOUT_ERROR'
                ) {
                    setPasswordError('')
                    setResetPasswordError(
                        'Error connecting to server, please try later'
                    )
                }
            }
        })
    }

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: isSM ? '80%' : '40%',
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <img
                        src={Logo}
                        alt="Logo"
                        style={{ width: '64px', height: '64px' }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'end',
                        }}>
                        <Typography component="h1" variant="h5" color="primary">
                            Reset Password
                        </Typography>
                        <Typography
                            component="span"
                            display={isXS ? 'none' : 'inline'}
                            variant="subtitle2">
                            Type your new password below
                        </Typography>
                    </Box>
                </Box>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}>
                    <TextField
                        required
                        fullWidth
                        id="password"
                        label="Password"
                        name="password"
                        type="password"
                        value={password}
                        error={!!passwordError}
                        helperText={passwordError}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => setPassword(event.target.value)}
                    />
                    <LoadingButton
                        type="submit"
                        fullWidth
                        sx={{ my: 3 }}
                        loading={resetAPICalling}
                        loadingPosition="end"
                        endIcon={<Icon>arrow_forward</Icon>}
                        variant="contained"
                        disableElevation>
                        Submit
                    </LoadingButton>
                    <TransitionGroup>
                        {!!resetPasswordError && (
                            <Collapse>
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {resetPasswordError}
                                </Alert>
                            </Collapse>
                        )}
                        {!!resetPasswordSuccess && (
                            <Collapse>
                                <React.Fragment>
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        Password changed successfully
                                    </Alert>
                                    <Grid container justifyContent="center">
                                        <Grid item>
                                            <Link
                                                component={RouterLink}
                                                to={'/login'}
                                                variant="body2">
                                                Sign in
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </React.Fragment>
                            </Collapse>
                        )}
                    </TransitionGroup>
                </Box>
            </Box>
        </Box>
    )
}

export default ResetPassword
