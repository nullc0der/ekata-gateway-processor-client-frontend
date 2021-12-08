import React from 'react'

import useMediaQuery from '@mui/material/useMediaQuery'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import AppRoutes from './AppRoutes'
import { useAppSelector } from 'hooks/reduxHooks'
import { getDesignToken } from 'global-styles/functions'

function App() {
    const preferredMode = useAppSelector((state) => state.ui.preferredMode)
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    const theme = React.useMemo(
        () =>
            createTheme(
                getDesignToken(
                    preferredMode === 'system'
                        ? prefersDarkMode
                            ? 'dark'
                            : 'light'
                        : preferredMode
                )
            ),
        [prefersDarkMode, preferredMode]
    )

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {AppRoutes()}
        </ThemeProvider>
    )
}

export default App
