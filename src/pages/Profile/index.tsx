import { useEffect } from 'react'

import { Container, Grid, Typography } from '@mui/material'
import PageHeader from 'components/PageHeader'
import { useMatomo } from '@datapunt/matomo-tracker-react'

import { useAppSelector } from 'hooks/reduxHooks'
import EditProfile from './EditProfile'
import ProfileCard from './ProfileCard'

const Profile = () => {
    const userData = useAppSelector((state) => state.user.userData)
    const { trackPageView } = useMatomo()

    useEffect(() => {
        trackPageView({})
    }, [trackPageView])

    return (
        <Container maxWidth="lg">
            <PageHeader>
                <Typography variant="h6" fontWeight="bold">
                    Profile
                </Typography>
            </PageHeader>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <ProfileCard userData={userData} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <EditProfile userData={userData} />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Profile
