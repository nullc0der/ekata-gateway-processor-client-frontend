import React, { useState } from 'react'

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

import { forgotPassword } from 'api/auth'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [forgotPasswordError, setForgotPasswordError] = useState('')
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        forgotPassword(email).then((response) => {
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
                <Typography component="h5">
                    Type your email address below to get a link to reset your
                    password
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}>
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ my: 3 }}>
                        Submit
                    </Button>
                    {!!forgotPasswordError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {forgotPasswordError}
                        </Alert>
                    )}
                    {!!forgotPasswordSuccess && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Please check your inbox, you should get an email
                            with reset password link
                        </Alert>
                    )}
                </Box>
            </Paper>
        </Container>
    )
}

export default ForgotPassword
