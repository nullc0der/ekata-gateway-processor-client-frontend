import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'

import Avatar from '@mui/material/Avatar'
import Icon from '@mui/material/Icon'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'

import { verifyEmail } from 'api/auth'

const VerifyEmail = () => {
    const params = useParams()
    const [verificationResult, setVerificationResult] = useState('')
    const [showLoginLink, setShowLoginLink] = useState(false)

    useEffect(() => {
        const token = params.token || ''
        verifyEmail(token).then((response) => {
            if (response.ok) {
                setVerificationResult('Email Verified Successfully')
                setShowLoginLink(true)
            } else {
                setVerificationResult('Something went wrong, please try later')
            }
        })
    }, [params.token])

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
                <Typography component="h5" sx={{ mt: 2 }}>
                    {verificationResult}
                </Typography>
                {!!showLoginLink && (
                    <Link
                        component={RouterLink}
                        to={'/login'}
                        variant="body2"
                        sx={{ mt: 2 }}>
                        Sign in
                    </Link>
                )}
            </Paper>
        </Container>
    )
}

export default VerifyEmail
