import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'

import get from 'lodash/get'

import Avatar from '@mui/material/Avatar'
import Icon from '@mui/material/Icon'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'

import { resetPassword } from 'api/auth'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [token, setToken] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [resetPasswordError, setResetPasswordError] = useState('')
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false)

    const params = useParams()

    useEffect(() => {
        if (params.token !== token) {
            setToken(params.token || '')
        }
    }, [params.token, token])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        resetPassword(token, password).then((response) => {
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
                <Typography component="h5">Reset Password</Typography>
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ my: 3 }}>
                        Submit
                    </Button>
                    {!!resetPasswordError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {resetPasswordError}
                        </Alert>
                    )}
                    {!!resetPasswordSuccess && (
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
                    )}
                </Box>
            </Paper>
        </Container>
    )
}

export default ResetPassword
