import React from 'react'

import { useLocation, useNavigate } from 'react-router'

import {
    Drawer,
    List,
    ListItemButton,
    useMediaQuery,
    Box,
    Icon,
    ListItemIcon,
    Typography,
    ListItemText,
    useTheme,
} from '@mui/material'

import { drawerWidth } from 'global-styles/variables'
import sidebarItems from './sidebarItems'

interface SideBarProps {
    sidebarOpenMobile: boolean
    setSidebarOpenMobile: (open: boolean) => void
}

const SideBar = ({ sidebarOpenMobile, setSidebarOpenMobile }: SideBarProps) => {
    const theme = useTheme()
    const isSM = useMediaQuery(theme.breakpoints.down('md'))
    const navigate = useNavigate()
    const location = useLocation()

    const navigateTo = (link: string) => {
        navigate(link)
        if (isSM) {
            setSidebarOpenMobile(false)
        }
    }

    const drawerItem = (
        <Box sx={{ display: 'flex', flexDirection: 'column', px: 2.5 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 1,
                }}>
                <Icon>apps</Icon>
                <Typography variant="h6">Ekata</Typography>
                <Typography variant="subtitle2">Gateway Processor</Typography>
            </Box>
            <List sx={{ marginTop: 1 }}>
                {sidebarItems.map((x, i) => (
                    <ListItemButton
                        key={i}
                        selected={location.pathname === x.link}
                        sx={{ padding: '8px 20px', borderRadius: 2, mt: 1 }}
                        onClick={() => navigateTo(x.link)}>
                        <ListItemIcon>
                            <Icon sx={{ lineHeight: '0.9' }}>{x.icon}</Icon>
                        </ListItemIcon>
                        {/* <Typography variant="body2">{x.name}</Typography> */}
                        <ListItemText
                            primary={x.name}
                            primaryTypographyProps={{ variant: 'body2' }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    )

    return !isSM ? (
        <Drawer
            variant="permanent"
            sx={{
                '& .MuiDrawer-paper': {
                    width: `${drawerWidth}px`,
                    backgroundColor: 'background.default',
                },
            }}
            open>
            {drawerItem}
        </Drawer>
    ) : (
        <Drawer
            variant="temporary"
            open={sidebarOpenMobile}
            onClose={() => setSidebarOpenMobile(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
                '& .MuiDrawer-paper': {
                    width: `${drawerWidth}px`,
                    backgroundColor: 'background.default',
                    backgroundImage: 'none',
                },
            }}>
            {drawerItem}
        </Drawer>
    )
}

export default SideBar
