import { useEffect } from 'react'
import { Box, Avatar, Icon, Typography, Grid, Chip, Stack } from '@mui/material'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import get from 'lodash/get'

import BasicCard from 'components/BasicCard'
import { UserData } from 'store/userSlice'
import { getTwoFactorState } from 'api/user'
import { useAppSelector, useAppDispatch } from 'hooks/reduxHooks'
import { update2FAEnabled } from 'store/user2FASlice'

interface ProfileCardProps {
    userData: UserData
}

const ProfileCard = ({ userData }: ProfileCardProps) => {
    const dispatch = useAppDispatch()
    const user2FAEnabled = useAppSelector((state) => state.user2FA.isEnabled)

    useEffect(() => {
        getTwoFactorState().then((response) => {
            if (response.ok) {
                dispatch(
                    update2FAEnabled(get(response.data, 'is_enabled', false))
                )
            }
        })
    }, [dispatch])

    return (
        <BasicCard>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 4,
                    position: 'relative',
                }}>
                <Box
                    sx={{
                        position: 'absolute',
                        right: { xs: '-15px', md: 0 },
                        top: { xs: '-15px', md: '-5px' },
                    }}>
                    <Stack direction="row" spacing={1}>
                        {!!userData.isVerified && (
                            <Chip
                                label="Email Verified"
                                color="success"
                                size="small"
                                variant="outlined"
                            />
                        )}
                        {!!userData.isActive && (
                            <Chip
                                label="Active"
                                color="success"
                                size="small"
                                variant="outlined"
                            />
                        )}
                        <Chip
                            label={
                                user2FAEnabled ? '2FA Enabled' : '2FA Disabled'
                            }
                            color={user2FAEnabled ? 'success' : 'warning'}
                            size="small"
                            variant="outlined"
                        />
                    </Stack>
                </Box>
                <Avatar sx={{ width: '80px', height: '80px', mb: 2 }}>
                    {userData.username ? (
                        <Typography component="span" fontSize="2rem">
                            {userData.username.slice(0, 1).toUpperCase()}
                        </Typography>
                    ) : (
                        <Icon fontSize="large">person</Icon>
                    )}
                </Avatar>
                <Typography variant="body2">@{userData.username}</Typography>
                <Grid container mt={3} justifyContent="space-evenly">
                    <Grid item xs={12} sm={5}>
                        <Typography>ID</Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <Typography variant="body2" lineHeight={2}>
                            {userData.id}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container mt={1} justifyContent="space-evenly">
                    <Grid item xs={12} sm={5}>
                        <Typography>Email Address</Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <Typography variant="body2" lineHeight={2}>
                            {userData.email}
                        </Typography>
                    </Grid>
                </Grid>
                {(!!userData.firstName || !!userData.lastName) && (
                    <Grid container mt={1} justifyContent="space-evenly">
                        <Grid item xs={12} sm={5}>
                            <Typography>Name</Typography>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Typography
                                variant="body2"
                                lineHeight={
                                    2
                                }>{`${userData.firstName} ${userData.lastName}`}</Typography>
                        </Grid>
                    </Grid>
                )}
                {!!userData.joinedOn && (
                    <Grid container mt={1} justifyContent="space-evenly">
                        <Grid item xs={12} sm={5}>
                            <Typography>Client From</Typography>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Typography variant="body2" lineHeight={2}>
                                {formatDistanceToNowStrict(
                                    new Date(userData.joinedOn)
                                )}
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </BasicCard>
    )
}

export default ProfileCard
