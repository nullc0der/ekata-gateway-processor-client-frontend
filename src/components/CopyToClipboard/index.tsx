import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard'
import { Icon } from '@mui/material'

import { useAppDispatch } from 'hooks/reduxHooks'
import { updateSnackBar } from 'store/snackBarSlice'

interface CopyToClipboardProps {
    text: string
}

const CopyToClipboard = ({ text }: CopyToClipboardProps) => {
    const dispatch = useAppDispatch()
    return (
        <ReactCopyToClipboard
            text={text}
            onCopy={() =>
                dispatch(
                    updateSnackBar({
                        message: 'Copied to clipboard',
                        severity: 'success',
                    })
                )
            }>
            <Icon sx={{ cursor: 'pointer' }}>content_copy</Icon>
        </ReactCopyToClipboard>
    )
}

export default CopyToClipboard
