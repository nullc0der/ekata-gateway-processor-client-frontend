import { Grid, Box, Typography } from '@mui/material'

import { ProjectStatsData } from 'api/project'
import BasicCard from 'components/BasicCard'

interface ProjectStatsProps {
    data: ProjectStatsData
}

const ProjectStats = ({ data }: ProjectStatsProps) => {
    return (
        <Grid container spacing={2} mb={4}>
            <Grid item xs={12} md={4}>
                <BasicCard>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <Typography variant="subtitle2">
                            Total Projects
                        </Typography>
                        <Typography variant="h4">
                            {data.total_project}
                        </Typography>
                    </Box>
                </BasicCard>
            </Grid>
            <Grid item xs={12} md={4}>
                <BasicCard>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <Typography variant="subtitle2">
                            Active Projects
                        </Typography>
                        <Typography variant="h4">
                            {data.active_project}
                        </Typography>
                    </Box>
                </BasicCard>
            </Grid>
            <Grid item xs={12} md={4}>
                <BasicCard>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <Typography variant="subtitle2">
                            Verified Domain
                        </Typography>
                        <Typography variant="h4">
                            {data.verified_domain}
                        </Typography>
                    </Box>
                </BasicCard>
            </Grid>
        </Grid>
    )
}

export default ProjectStats
