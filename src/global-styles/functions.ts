import { PaletteMode } from '@mui/material'

export const getDesignToken = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'dark' && {
            background: {
                default: 'rgb(22, 28, 36)',
                paper: 'rgb(33, 43, 54)',
            },
        }),
    },
})
