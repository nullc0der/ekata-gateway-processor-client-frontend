import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router'

import {
    AppBar,
    Toolbar,
    Avatar,
    Icon,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Typography,
    Divider,
    Button,
    ButtonGroup,
} from '@mui/material'
import { styled, alpha } from '@mui/system'

import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'

import { drawerWidth, topbarHeight } from 'global-styles/variables'

import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { changePreferredMode } from 'store/uiSlice'
import { deauthenticateUser } from 'store/authSlice'
import { getUser } from 'store/userSlice'

const SpacerDiv = styled('div')({
    flexGrow: 1,
})

interface TopBarProps {
    setSidebarOpenMobile: (open: boolean) => void
}

const TopBar = ({ setSidebarOpenMobile }: TopBarProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const preferredMode = useAppSelector((state) => state.ui.preferredMode)
    const userData = useAppSelector((state) => state.user.userData)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const userMenuOpen = Boolean(anchorEl)

    useEffect(() => {
        dispatch(getUser())
    }, [dispatch])

    const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const closeUserMenu = () => {
        setAnchorEl(null)
    }

    const logoutUser = () => {
        dispatch(deauthenticateUser())
        navigate('/login')
    }

    return (
        <AppBar
            sx={{
                backgroundColor: 'background.default',
                boxShadow: 'none',
                backgroundImage: 'none',
                width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
            }}>
            <Toolbar sx={{ height: topbarHeight }}>
                <IconButton
                    sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                    onClick={() => setSidebarOpenMobile(true)}>
                    <Icon>menu</Icon>
                </IconButton>
                <SpacerDiv />
                <IconButton onClick={openUserMenu}>
                    <Avatar>
                        {userData.username ? (
                            userData.username.slice(0, 1).toUpperCase()
                        ) : (
                            <Icon>person</Icon>
                        )}
                    </Avatar>
                </IconButton>
            </Toolbar>
            <Menu
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={closeUserMenu}
                onClick={closeUserMenu}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        width: '200px',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                <Box sx={{ px: 2.5 }}>
                    <Typography variant="subtitle1">Hello</Typography>
                    <Typography
                        variant="subtitle2"
                        component="p"
                        color="text.secondary">
                        {userData.username ? userData.username : 'username'}
                    </Typography>
                    {!!userData.joinedOn && (
                        <Typography
                            variant="caption"
                            component="p"
                            color="text.secondary">
                            Client from:{' '}
                            {formatDistanceToNowStrict(
                                new Date(userData.joinedOn)
                            )}
                        </Typography>
                    )}
                </Box>
                <Divider sx={{ my: 1 }} />
                <MenuItem
                    sx={{ fontSize: '12px' }}
                    onClick={() => navigate('/profile')}>
                    <Icon sx={{ mr: 1 }}>perm_identity</Icon>
                    Profile
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ px: 2.5, pt: 1 }}>
                    <ButtonGroup
                        variant="outlined"
                        size="large"
                        sx={{ width: '100%' }}>
                        <Button
                            onClick={() =>
                                dispatch(changePreferredMode('light'))
                            }
                            sx={{
                                borderRadius: 2,
                                ...(preferredMode === 'light' && {
                                    backgroundColor: (theme) =>
                                        alpha(
                                            theme.palette.text.primary,
                                            theme.palette.action.hoverOpacity
                                        ),
                                }),
                            }}>
                            <Icon fontSize="small">light_mode</Icon>
                        </Button>
                        <Button
                            sx={{
                                ...(preferredMode === 'dark' && {
                                    backgroundColor: (theme) =>
                                        alpha(
                                            theme.palette.text.primary,
                                            theme.palette.action.hoverOpacity
                                        ),
                                }),
                            }}
                            onClick={() =>
                                dispatch(changePreferredMode('dark'))
                            }>
                            <Icon fontSize="small">dark_mode</Icon>
                        </Button>
                        <Button
                            onClick={() =>
                                dispatch(changePreferredMode('system'))
                            }
                            sx={{
                                borderRadius: 2,
                                ...(preferredMode === 'system' && {
                                    backgroundColor: (theme) =>
                                        alpha(
                                            theme.palette.text.primary,
                                            theme.palette.action.hoverOpacity
                                        ),
                                }),
                            }}>
                            <Icon fontSize="small">settings_brightness</Icon>
                        </Button>
                    </ButtonGroup>
                </Box>
                <Box sx={{ px: 2.5, py: 2, mb: -1 }}>
                    <Button
                        variant="outlined"
                        sx={{
                            width: '100%',
                            textTransform: 'capitalize',
                            borderRadius: 2,
                        }}
                        onClick={logoutUser}>
                        Logout
                    </Button>
                </Box>
            </Menu>
        </AppBar>
    )
}

export default TopBar
