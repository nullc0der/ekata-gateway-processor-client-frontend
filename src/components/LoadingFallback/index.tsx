import { Box, useTheme } from '@mui/material'

import { ReactComponent as Loader } from 'assets/image/loader.svg'

const LoadingFallback = () => {
    const theme = useTheme()
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Box
                sx={{
                    width: '100px',
                    height: '100px',
                }}>
                <Loader fill={theme.palette.primary.main} />
            </Box>
        </Box>
    )
}

export default LoadingFallback
