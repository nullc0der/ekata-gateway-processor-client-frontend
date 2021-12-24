import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Stack,
    Icon,
    IconButton,
} from '@mui/material'

import CopyToClipboard from 'components/CopyToClipboard'

interface ApiKeyDialogProps {
    apiKey: string
    paymentSignatureSecret: string
    open: boolean
    onClose: () => void
}

const ApiKeyDialog = ({
    apiKey,
    paymentSignatureSecret,
    open,
    onClose,
}: ApiKeyDialogProps) => {
    return (
        <Dialog open={open} maxWidth="lg">
            <DialogTitle>
                Key(s) for your project is created
                <IconButton
                    sx={{ position: 'absolute', right: '0', top: '0' }}
                    onClick={onClose}>
                    <Icon>cancel</Icon>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2">
                    Copy the following key(s) and keep it somewhere safe, once
                    you close this dialog it is not recoverable
                </Typography>
                {!!apiKey.length && (
                    <>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                            mt={2}>
                            Api Key
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography
                                variant="body1"
                                sx={{ wordBreak: 'break-all' }}>
                                {apiKey}
                            </Typography>
                            <CopyToClipboard text={apiKey} />
                        </Stack>
                    </>
                )}
                {!!paymentSignatureSecret.length && (
                    <>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                            mt={2}>
                            Payment Signature Secret
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography
                                variant="body1"
                                sx={{ wordBreak: 'break-all' }}>
                                {paymentSignatureSecret}
                            </Typography>
                            <CopyToClipboard text={paymentSignatureSecret} />
                        </Stack>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ApiKeyDialog
