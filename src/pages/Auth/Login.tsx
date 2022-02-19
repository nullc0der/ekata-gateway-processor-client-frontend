import React, { useEffect, useState } from 'react'

import { useLocation, Navigate } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'

import get from 'lodash/get'

import jwt_decode from 'jwt-decode'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTheme, Collapse, Icon } from '@mui/material'
import { TransitionGroup } from 'react-transition-group'

import { useMatomo } from '@datapunt/matomo-tracker-react'

import { login } from 'api/auth'
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { authenticateUser } from 'store/authSlice'
import { isTokenNotExpired } from 'utils/auth'
import HelpTooltip from 'components/HelpTooltip'
import EnhancedPasswordField from 'components/EnhancedPasswordField'
import Logo from 'assets/image/logo.svg'
import LoginSVG from 'assets/image/login.svg'

// TODO: form validation whether it resets and add again if new error, loading button on api call and placeholder, enhanced password on every password field, login redirection, active project redux, CORS on same origin

const Login = () => {
    const dispatch = useAppDispatch()
    const location = useLocation()
    const auth = useAppSelector((state) => state.auth)
    const { trackPageView } = useMatomo()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        twoFactorCode: '',
    })
    const [formError, setFormError] = useState({
        email: '',
        password: '',
        twoFactorCode: '',
    })
    const [twoFactorCodeRequired, setTwoFactorCodeRequired] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [loggingIn, setLoggingIn] = useState(false)
    const theme = useTheme()

    let navigateTo = location.state?.from?.pathname || '/projects'

    useEffect(() => {
        trackPageView({})
    }, [trackPageView])

    const onChangeFormData = (id: string, value: string) => {
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoggingIn(true)
        login(formData.email, formData.password, formData.twoFactorCode).then(
            (response) => {
                setLoggingIn(false)
                if (response.ok) {
                    setLoginError('')
                    setFormError({ email: '', password: '', twoFactorCode: '' })
                    const authToken = get(response.data, 'access_token', '')
                    const expiresAt =
                        get(jwt_decode(authToken), 'exp', 0) * 1000
                    dispatch(authenticateUser({ authToken, expiresAt }))
                } else {
                    if (response.status === 422) {
                        setLoginError('')
                        const details = get(response.data, 'detail', {})
                        const formErrors = {
                            email: '',
                            password: '',
                            twoFactorCode: '',
                        }
                        for (const detail of details) {
                            if (detail.loc[1] === 'username') {
                                formErrors.email = detail.msg
                            }
                            if (detail.loc[1] === 'password') {
                                formErrors.password = detail.msg
                            }
                            if (detail.loc[1] === 'two_factor_code') {
                                formErrors.twoFactorCode = detail.msg
                            }
                        }
                        setFormError(formErrors)
                    }
                    if (response.status === 400) {
                        const detail = get(response.data, 'detail', {})
                        setFormError({
                            email: '',
                            password: '',
                            twoFactorCode: '',
                        })
                        if (detail === 'LOGIN_BAD_CREDENTIALS') {
                            setLoginError('Invalid Credentials')
                        }
                        if (detail === 'LOGIN_USER_NOT_VERIFIED') {
                            setLoginError(
                                'Please verify your email address to login'
                            )
                        }
                        if (detail === 'REQUIRED_2FA_CODE') {
                            if (twoFactorCodeRequired) {
                                setFormError((prevState) => ({
                                    ...prevState,
                                    twoFactorCode: 'Invalid two factor code',
                                }))
                            } else {
                                setTwoFactorCodeRequired(true)
                            }
                        }
                    }
                    if (
                        response.problem === 'NETWORK_ERROR' ||
                        response.problem === 'CONNECTION_ERROR' ||
                        response.problem === 'TIMEOUT_ERROR'
                    ) {
                        setFormError({
                            email: '',
                            password: '',
                            twoFactorCode: '',
                        })
                        setLoginError(
                            'Error connecting to server, please try later'
                        )
                    }
                }
            }
        )
    }

    return auth.isAuthenticated && isTokenNotExpired() ? (
        <Navigate to={navigateTo} replace={true} />
    ) : (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
            }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: { xs: 1, md: 70 },
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: { xs: '80%', sm: '60%', md: '40%' },
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
                            <Typography
                                component="h1"
                                variant="h4"
                                color="primary">
                                Login
                            </Typography>
                            <Typography
                                component="span"
                                display={{ xs: 'none', sm: 'inline' }}
                                variant="subtitle2">
                                Enter email and password below to continue
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            error={!!formError.email}
                            helperText={formError.email}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                onChangeFormData(
                                    event.target.id,
                                    event.target.value
                                )
                            }
                        />
                        <EnhancedPasswordField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            id="password"
                            showPasswordStrength={false}
                            error={!!formError.password}
                            helperText={formError.password}
                            onChange={(id: string, value: string) =>
                                onChangeFormData(id, value)
                            }
                        />
                        <TransitionGroup>
                            {!!twoFactorCodeRequired && (
                                <Collapse>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="twoFactor"
                                        label="Two Factor Code"
                                        id="twoFactorCode"
                                        value={formData.twoFactorCode}
                                        error={!!formError.twoFactorCode}
                                        helperText={formError.twoFactorCode}
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            onChangeFormData(
                                                event.target.id,
                                                event.target.value
                                            )
                                        }
                                    />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }}>
                                        <Typography variant="subtitle2">
                                            Lost access to authenticator device{' '}
                                        </Typography>
                                        <HelpTooltip title="Use one of your recovery code" />
                                    </Box>
                                </Collapse>
                            )}
                        </TransitionGroup>
                        <LoadingButton
                            type="submit"
                            fullWidth
                            sx={{ my: 3 }}
                            loading={loggingIn}
                            loadingPosition="end"
                            endIcon={<Icon>arrow_forward</Icon>}
                            variant="contained"
                            disableElevation>
                            Sign In
                        </LoadingButton>
                        <TransitionGroup>
                            {!!loginError && (
                                <Collapse>
                                    <Alert severity="error" sx={{ mb: 3 }}>
                                        {loginError}
                                    </Alert>
                                </Collapse>
                            )}
                        </TransitionGroup>
                    </Box>
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <Link
                                component={RouterLink}
                                to="/forgot-password"
                                variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                component={RouterLink}
                                to="/register"
                                variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box
                sx={{
                    flex: 30,
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeft: '1px solid',
                    borderColor:
                        theme.palette.mode === 'dark'
                            ? theme.palette.grey[800]
                            : theme.palette.grey[200],
                }}>
                <img src={LoginSVG} style={{ width: '250px' }} alt="Login" />
                <Typography
                    component="span"
                    variant="h4"
                    color="primary"
                    mt={4}>
                    Hi, Welcome Back
                </Typography>
            </Box>
        </Box>
    )
}

export default Login
