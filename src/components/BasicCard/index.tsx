import React from 'react'

import { Card } from '@mui/material'

interface BasicCardProps {
    children?: React.ReactNode
}

const BasicCard = ({ children }: BasicCardProps) => {
    return (
        <Card
            sx={{
                p: 3,
                backgroundImage: 'none',
                borderRadius: 4,
                boxShadow:
                    'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 8px 24px -4px',
            }}
            elevation={0}>
            {children}
        </Card>
    )
}

export default BasicCard
