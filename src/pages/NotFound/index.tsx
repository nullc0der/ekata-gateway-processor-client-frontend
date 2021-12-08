import { useEffect } from 'react'

import { useLocation } from 'react-router'

import { Container, Typography, Box } from '@mui/material'

import { useMatomo } from '@datapunt/matomo-tracker-react'

import { ReactComponent as NotFoundSVG } from 'assets/image/not_found.svg'

const NotFound = () => {
    const location = useLocation()
    const { trackPageView } = useMatomo()

    useEffect(() => {
        trackPageView({})
    }, [trackPageView])

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <NotFoundSVG style={{ width: '300px', height: '300px' }} />
                <Typography component="p" sx={{ mt: 2 }}>
                    Requested path {location.pathname} can't be found
                </Typography>
            </Box>
        </Container>
    )
}

export default NotFound
