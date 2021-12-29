import { useState } from 'react'
import { ClickAwayListener, Tooltip, IconButton, Icon } from '@mui/material'

interface HelpTooltipProps {
    title: string
}

const HelpTooltip = ({ title }: HelpTooltipProps) => {
    const [helpTooltipOpen, setHelpTooltipOpen] = useState(false)

    return (
        <ClickAwayListener onClickAway={() => setHelpTooltipOpen(false)}>
            <Tooltip
                disableFocusListener
                disableHoverListener
                disableTouchListener
                open={helpTooltipOpen}
                onClose={() => setHelpTooltipOpen(false)}
                title={title}
                arrow>
                <IconButton onClick={() => setHelpTooltipOpen(true)}>
                    <Icon color="warning">help_outline</Icon>
                </IconButton>
            </Tooltip>
        </ClickAwayListener>
    )
}

export default HelpTooltip
