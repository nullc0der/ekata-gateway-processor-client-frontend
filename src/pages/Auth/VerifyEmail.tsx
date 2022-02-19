import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'

import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Box, useTheme, useMediaQuery } from '@mui/material'

import Logo from 'assets/image/logo.svg'
import { verifyEmail } from 'api/auth'

const VerifyEmail = () => {
    const params = useParams()
    const [verificationResult, setVerificationResult] = useState('')
    const [showLoginLink, setShowLoginLink] = useState(false)
    const theme = useTheme()
    const isSM = useMediaQuery(theme.breakpoints.down('md'))

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
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    <img
                        src={Logo}
                        alt="Logo"
                        style={{ width: '64px', height: '64px' }}
                    />
                    <Typography component="h1" variant="h5" color="primary">
                        Verify Email
                    </Typography>
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
                </Box>
            </Box>
        </Box>
    )
}

export default VerifyEmail
