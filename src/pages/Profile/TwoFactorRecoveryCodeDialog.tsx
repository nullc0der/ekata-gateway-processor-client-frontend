import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Box,
    IconButton,
    Icon,
    Alert,
    Card,
    CardContent,
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
        <Dialog open={codes.length > 0}>
            <DialogTitle sx={{ textAlign: 'center' }}>
                Recovery codes
                <IconButton
                    sx={{ position: 'absolute', right: '0', top: '0' }}
                    onClick={onClose}>
                    <Icon>cancel</Icon>
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                    Copy these codes to somewhere safe.
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        my: 2,
                    }}>
                    <Card
                        sx={{ minWidth: '250px', py: 2, position: 'relative' }}>
                        <CardContent>
                            {codes.map((x, i) => (
                                <Typography variant="h5" key={i}>
                                    {x}
                                </Typography>
                            ))}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: '5px',
                                    right: '5px',
                                }}>
                                <CopyToClipboard
                                    text={`Two Factor Authentication recovery code for ${
                                        window.location.host
                                    }\n${codes
                                        .map((x) => `[ ] ${x}`)
                                        .join('\n')}`}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
                <Alert severity="warning" variant="outlined">
                    These codes will not be accessible once you close this
                    dialog.
                </Alert>
            </DialogContent>
        </Dialog>
    )
}

export default TwoFactorRecoveryCodeDialog
