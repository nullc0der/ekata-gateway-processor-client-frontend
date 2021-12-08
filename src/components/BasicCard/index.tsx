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
            }}
            elevation={12}>
            {children}
        </Card>
    )
}

export default BasicCard
