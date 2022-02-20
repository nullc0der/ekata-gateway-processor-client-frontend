import React, { useState } from 'react'

import { Outlet, Navigate, useLocation } from 'react-router'

import { Box } from '@mui/material'

import { useAppSelector } from 'hooks/reduxHooks'
import { isTokenNotExpired } from 'utils/auth'

import TopBar from 'components/TopBar'
import SideBar from 'components/SideBar'
import SnackBarAlert from 'components/SnackBarAlert'
import { drawerWidth, topbarHeight } from 'global-styles/variables'

const Dashboard = () => {
    const auth = useAppSelector((state) => state.auth)
    const location = useLocation()
    const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false)

    return auth.isAuthenticated && isTokenNotExpired() ? (
        location.pathname === '/' ? (
            <Navigate replace={true} to="/projects" />
        ) : (
            <Box
                sx={{
                    display: 'flex',
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: { xs: 0, md: `${drawerWidth}px` },
                    }}
                    component="nav">
                    <SideBar
                        sidebarOpenMobile={sidebarOpenMobile}
                        setSidebarOpenMobile={setSidebarOpenMobile}
                    />
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: { xs: 0, md: `${drawerWidth}px` },
                        right: 0,
                        overflowY: 'auto',
                    }}
                    component="main">
                    <TopBar setSidebarOpenMobile={setSidebarOpenMobile} />
                    <Box
                        sx={{
                            marginTop: `${topbarHeight}px`,
                            py: 3,
                        }}>
                        <Outlet />
                    </Box>
                </Box>
                <SnackBarAlert />
            </Box>
        )
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    )
}

export default Dashboard
