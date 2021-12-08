import { Box } from '@mui/material'

interface PageHeaderProps {
    children?: React.ReactNode
}

const PageHeader = ({ children }: PageHeaderProps) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 5 }}>
            {children}
        </Box>
    )
}

export default PageHeader
