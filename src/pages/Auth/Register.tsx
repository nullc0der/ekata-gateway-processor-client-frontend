import React, { useState, useEffect } from 'react'

import { Link as RouterLink } from 'react-router-dom'

import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

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

    useEffect(() => {
        trackPageView({})
    }, [trackPageView])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value,
        }))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        register(formData).then((response) => {
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
                    Register
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                fullWidth
                                id="first_name"
                                label="First Name"
                                error={!!formError.first_name}
                                helperText={formError.first_name}
                                value={formData.first_name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="last_name"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                error={!!formError.last_name}
                                helperText={formError.last_name}
                                value={formData.last_name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={!!formError.password}
                                helperText={formError.password}
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ my: 3 }}>
                        Sign Up
                    </Button>
                    {!!registerError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {registerError}
                        </Alert>
                    )}
                    {!!registerSuccess && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            You are registered successfully, please check your
                            inbox, you should get an email to verify your email
                            address
                        </Alert>
                    )}
                </Box>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link
                            component={RouterLink}
                            to={'/login'}
                            variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default Register
