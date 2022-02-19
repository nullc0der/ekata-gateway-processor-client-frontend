import React, { useState, useEffect } from 'react'

import { Link as RouterLink } from 'react-router-dom'

import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import { useMatomo } from '@datapunt/matomo-tracker-react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import { LoadingButton } from '@mui/lab'
import { useMediaQuery, useTheme, Collapse, Icon } from '@mui/material'
import { TransitionGroup } from 'react-transition-group'

import EnhancedPasswordField from 'components/EnhancedPasswordField'
import Logo from 'assets/image/logo.svg'
import LoginSVG from 'assets/image/login.svg'
import { register } from 'api/auth'

const Register = () => {
    const { trackPageView } = useMatomo()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        first_name: '',
        last_name: '',
    })
    const [formError, setFormError] = useState({
        email: '',
        password: '',
        username: '',
        first_name: '',
        last_name: '',
    })
    const [registerError, setRegisterError] = useState('')
    const [registerSuccess, setRegisterSuccess] = useState(false)
    const [signingUp, setSigningUp] = useState(false)
    const theme = useTheme()
    const isSM = useMediaQuery(theme.breakpoints.down('md'))
    const isXS = useMediaQuery(theme.breakpoints.down('sm'))

    useEffect(() => {
        trackPageView({})
    }, [trackPageView])

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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSigningUp(true)
        register(formData).then((response) => {
            setSigningUp(false)
            if (response.ok) {
                setFormError({
                    email: '',
                    password: '',
                    username: '',
                    first_name: '',
                    last_name: '',
                })
                setRegisterError('')
                setRegisterSuccess(true)
            } else {
                if (response.status === 422) {
                    setRegisterError('')
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
                    const detail = get(response.data, 'detail', {})
                    if (detail.code === 'REGISTER_INVALID_PASSWORD') {
                        setFormError((prevState) => ({
                            ...prevState,
                            password: isEmpty(detail) ? '' : detail.reason,
                        }))
                    }
                    if (detail === 'REGISTER_USER_ALREADY_EXISTS') {
                        setFormError({
                            email: '',
                            password: '',
                            username: '',
                            first_name: '',
                            last_name: '',
                        })
                        setRegisterError('You are already signed up')
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
                        username: '',
                        first_name: '',
                        last_name: '',
                    })
                    setRegisterError(
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
            }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: isSM ? 1 : 70,
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: isSM ? (isXS ? '80%' : '60%') : '50%',
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
                                Signup
                            </Typography>
                            <Typography
                                component="span"
                                display={isXS ? 'none' : 'inline'}
                                variant="subtitle2">
                                Submit following form to complete signup process
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}>
                        <Grid container>
                            <Grid item xs={12} sm={6} pb={2} pr={!isSM ? 2 : 0}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    fullWidth
                                    id="first_name"
                                    label="First Name"
                                    error={!!formError.first_name}
                                    helperText={formError.first_name}
                                    value={formData.first_name}
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
                            <Grid item xs={12} sm={6} pb={2}>
                                <TextField
                                    fullWidth
                                    id="last_name"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    error={!!formError.last_name}
                                    helperText={formError.last_name}
                                    value={formData.last_name}
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
                            <Grid item xs={12} pb={2}>
                                <TextField
                                    autoComplete="username"
                                    name="userName"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    error={!!formError.username}
                                    helperText={formError.username}
                                    value={formData.username}
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
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    error={!!formError.email}
                                    helperText={formError.email}
                                    value={formData.email}
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
                            <Grid item xs={12}>
                                <EnhancedPasswordField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    id="password"
                                    error={!!formError.password}
                                    helperText={formError.password}
                                    showPasswordStrength={true}
                                    onChange={(id: string, value: string) =>
                                        handleInputChange(id, value)
                                    }
                                />
                            </Grid>
                        </Grid>
                        <LoadingButton
                            type="submit"
                            fullWidth
                            sx={{ my: 3 }}
                            loading={signingUp}
                            loadingPosition="end"
                            endIcon={<Icon>arrow_forward</Icon>}
                            variant="contained"
                            disableElevation>
                            Sign Up
                        </LoadingButton>
                        <TransitionGroup>
                            {!!registerError && (
                                <Collapse>
                                    <Alert severity="error" sx={{ mb: 3 }}>
                                        {registerError}
                                    </Alert>
                                </Collapse>
                            )}
                            {!!registerSuccess && (
                                <Collapse>
                                    <Alert severity="success" sx={{ mb: 3 }}>
                                        You are registered successfully, please
                                        check your inbox, you should get an
                                        email to verify your email address
                                    </Alert>
                                </Collapse>
                            )}
                        </TransitionGroup>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link
                                    component={RouterLink}
                                    to="/login"
                                    variant="body2">
                                    {'Already have an account? Login'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    flex: 30,
                    display: isSM ? 'none' : 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2,
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
                    mt={1}>
                    Welcome
                </Typography>
                <Typography
                    component="span"
                    variant="body1"
                    color="primary"
                    mt={1}>
                    Signup to create your project, monitor payments, check
                    payouts etc...
                </Typography>
            </Box>
        </Box>
    )
}

export default Register
