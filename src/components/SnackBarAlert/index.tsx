import { Alert, Snackbar } from '@mui/material'

import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { updateSnackBar } from 'store/snackBarSlice'

const SnackBarAlert = () => {
    const snackBarData = useAppSelector((state) => state.snackBar)
    const dispatch = useAppDispatch()

    const handleSnackBarClose = (
        event?: React.SyntheticEvent,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(updateSnackBar({ severity: 'success', message: '' }))
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={!!snackBarData.message}
            autoHideDuration={3600}
            onClose={handleSnackBarClose}>
            <Alert
                onClose={handleSnackBarClose}
                severity={snackBarData.severity}
                sx={{ width: '100%' }}>
                {snackBarData.message}
            </Alert>
        </Snackbar>
    )
}

export default SnackBarAlert
