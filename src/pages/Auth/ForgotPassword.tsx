import React, { useState } from 'react'

import get from 'lodash/get'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import { LoadingButton } from '@mui/lab'
import { useMediaQuery, useTheme, Collapse, Icon } from '@mui/material'
import { TransitionGroup } from 'react-transition-group'

import Logo from 'assets/image/logo.svg'
import { forgotPassword } from 'api/auth'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [forgotPasswordError, setForgotPasswordError] = useState('')
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)
    const [forgotAPIcalling, setForgotAPIcalling] = useState(false)
    const theme = useTheme()
    const isSM = useMediaQuery(theme.breakpoints.down('md'))
    const isXS = useMediaQuery(theme.breakpoints.down('sm'))

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setForgotAPIcalling(true)
        forgotPassword(email).then((response) => {
            setForgotAPIcalling(false)
            if (response.ok) {
                setEmailError('')
                setForgotPasswordError('')
                setForgotPasswordSuccess(true)
            } else {
                if (response.status === 422) {
                    setForgotPasswordError('')
                    const details = get(response.data, 'detail', {})
                    for (const detail of details) {
                        if (detail.loc[1] === 'email') {
                            setEmailError(detail.msg)
                        }
                    }
                }
                if (
                    response.problem === 'NETWORK_ERROR' ||
                    response.problem === 'CONNECTION_ERROR' ||
                    response.problem === 'TIMEOUT_ERROR'
                ) {
                    setEmailError('')
                    setForgotPasswordError(
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
                            Forgot Password
                        </Typography>
                        <Typography
                            component="span"
                            display={isXS ? 'none' : 'inline'}
                            variant="subtitle2">
                            Type your email address below to get a link to reset
                            your password
                        </Typography>
                    </Box>
                </Box>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 2 }}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        error={!!emailError}
                        helperText={emailError}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => setEmail(event.target.value)}
                    />
                    <LoadingButton
                        type="submit"
                        fullWidth
                        sx={{ my: 3 }}
                        loading={forgotAPIcalling}
                        loadingPosition="end"
                        endIcon={<Icon>arrow_forward</Icon>}
                        variant="contained"
                        disableElevation>
                        Submit
                    </LoadingButton>
                    <TransitionGroup>
                        {!!forgotPasswordError && (
                            <Collapse>
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {forgotPasswordError}
                                </Alert>
                            </Collapse>
                        )}
                        {!!forgotPasswordSuccess && (
                            <Collapse>
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Please check your inbox, you should get an
                                    email with reset password link
                                </Alert>
                            </Collapse>
                        )}
                    </TransitionGroup>
                </Box>
            </Box>
        </Box>
    )
}

export default ForgotPassword
