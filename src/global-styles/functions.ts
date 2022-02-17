import { PaletteMode } from '@mui/material'
import { green } from '@mui/material/colors'

export const getDesignToken = (mode: PaletteMode) => ({
    palette: {
        mode,
        primary: {
            main: green[400],
            contrastText: '#fff',
        },
        ...(mode === 'dark' && {
            background: {
                default: 'rgb(22, 28, 36)',
                paper: 'rgb(33, 43, 54)',
            },
            text: {
                primary: '#e0e0e0',
            },
        }),
        ...(mode === 'light' && {
            text: {
                primary: '#616161',
            },
        }),
    },
})
