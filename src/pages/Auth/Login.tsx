import React, { useEffect, useState } from 'react'

import { useLocation, Navigate } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'

import get from 'lodash/get'

import jwt_decode from 'jwt-decode'

import Avatar from '@mui/material/Avatar'
import Icon from '@mui/material/Icon'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'

import { useMatomo } from '@datapunt/matomo-tracker-react'

import { login } from 'api/auth'
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { authenticateUser } from 'store/authSlice'
import { isTokenNotExpired } from 'utils/auth'

const Login = () => {
    const dispatch = useAppDispatch()
    const location = useLocation()
    const auth = useAppSelector((state) => state.auth)
    const { trackPageView } = useMatomo()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [formError, setFormError] = useState({ email: '', password: '' })
    const [loginError, setLoginError] = useState('')

    let navigateTo = location.state?.from?.pathname || '/projects'

    useEffect(() => {
        trackPageView({})
    }, [trackPageView])

    const onChangeFormData = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value,
        }))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        login(formData.email, formData.password).then((response) => {
            if (response.ok) {
                setLoginError('')
                setFormError({ email: '', password: '' })
                const authToken = get(response.data, 'access_token', '')
                const expiresAt = get(jwt_decode(authToken), 'exp', 0) * 1000
                dispatch(authenticateUser({ authToken, expiresAt }))
            } else {
                if (response.status === 422) {
                    setLoginError('')
                    const details = get(response.data, 'detail', {})
                    for (const detail of details) {
                        if (detail.loc[1] === 'username') {
                            setFormError((prevState) => ({
                                ...prevState,
                                email: detail.msg,
                            }))
                        }
                        if (detail.loc[1] === 'password') {
                            setFormError((prevState) => ({
                                ...prevState,
                                password: detail.msg,
                            }))
                        }
                    }
                }
                if (response.status === 400) {
                    const detail = get(response.data, 'detail', {})
                    setFormError({ email: '', password: '' })
                    if (detail === 'LOGIN_BAD_CREDENTIALS') {
                        setLoginError('Invalid Credentials')
                    }
                    if (detail === 'LOGIN_USER_NOT_VERIFIED') {
                        setLoginError(
                            'Please verify your email address to login'
                        )
                    }
                }
                if (
                    response.problem === 'NETWORK_ERROR' ||
                    response.problem === 'CONNECTION_ERROR' ||
                    response.problem === 'TIMEOUT_ERROR'
                ) {
                    setFormError({ email: '', password: '' })
                    setLoginError(
                        'Error connecting to server, please try later'
                    )
                }
            }
        })
    }

    return auth.isAuthenticated && isTokenNotExpired() ? (
        <Navigate to={navigateTo} replace={true} />
    ) : (
        <Container
            maxWidth="xs"
            sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 4,
                    backgroundImage: 'none',
                }}
                elevation={6}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <Icon>lock-outline</Icon>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
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
                        onChange={onChangeFormData}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        error={!!formError.password}
                        helperText={formError.password}
                        onChange={onChangeFormData}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ my: 3 }}>
                        Sign In
                    </Button>
                    {!!loginError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {loginError}
                        </Alert>
                    )}
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
            </Paper>
        </Container>
    )
}

export default Login