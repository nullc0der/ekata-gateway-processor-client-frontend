import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'

interface TxIDDialogProps {
    title: string
    txIDs: string[]
    open: boolean
    onClose: () => void
}

const TxIDDialog = ({ title, txIDs, open, onClose }: TxIDDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {txIDs.map((x, i) => (
                    <Typography variant="caption" component={'p'} key={i}>
                        {x}
                    </Typography>
                ))}
            </DialogContent>
        </Dialog>
    )
}

export default TxIDDialog
