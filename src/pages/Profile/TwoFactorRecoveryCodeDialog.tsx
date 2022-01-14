import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Box,
} from '@mui/material'

import CopyToClipboard from 'components/CopyToClipboard'

interface TwoFactorRecoveryCodeDialogProps {
    codes: string[]
    onClose: () => void
}

const TwoFactorRecoveryCodeDialog = ({
    codes,
    onClose,
}: TwoFactorRecoveryCodeDialogProps) => {
    return (
        <Dialog open={codes.length > 0} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'center' }}>
                Recovery codes
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2">
                    Copy these codes to somewhere safe it will not be accessible
                    once you close this dialog
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    {codes.map((x, i) => (
                        <Typography variant="h5" key={i}>
                            {x}
                        </Typography>
                    ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CopyToClipboard
                        text={`Two Factor Authentication recovery code for ${
                            window.location.host
                        }\n${codes.map((x) => `[ ] ${x}`).join('\n')}`}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default TwoFactorRecoveryCodeDialog
