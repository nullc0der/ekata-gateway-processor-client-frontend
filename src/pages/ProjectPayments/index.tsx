import React, { useEffect, useState } from 'react'
import {
    Container,
    Typography,
    Menu,
    MenuItem,
    Box,
    Button,
    Icon,
} from '@mui/material'
import { isEmpty } from 'lodash'
import { useMatomo } from '@datapunt/matomo-tracker-react'

import { getProjects } from 'api/project'
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import { ProjectData, updateProjects } from 'store/projectsSlice'
import PageHeader from 'components/PageHeader'
import PaymentsTable from './PaymentsTable'

const ProjectPayments = () => {
    const [selectedProject, setSelectedProject] = useState<ProjectData>()
    const [projectMenuAnchorEl, setProjectMenuAnchorEl] =
        useState<null | HTMLElement>(null)
    const projects = useAppSelector((state) => state.project.projects)
    const dispatch = useAppDispatch()
    const projectMenuOpen = Boolean(projectMenuAnchorEl)
    const { trackPageView } = useMatomo()

    useEffect(() => {
        trackPageView({})
    }, [trackPageView])

    useEffect(() => {
        if (isEmpty(projects)) {
            getProjects().then((response) => {
                if (response.ok) {
                    dispatch(updateProjects(response.data || []))
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickOpenProjectMenu = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        if (projectMenuOpen) {
            setProjectMenuAnchorEl(null)
        } else {
            setProjectMenuAnchorEl(event.currentTarget)
        }
    }

    const onCloseProjectMenu = (selectedProject?: ProjectData) => {
        if (selectedProject) {
            setSelectedProject(selectedProject)
        }
        setProjectMenuAnchorEl(null)
    }

    return (
        <Container maxWidth="lg">
            <PageHeader>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <Typography variant="h6" fontWeight="bold">
                        Payments by project
                    </Typography>
                    {!isEmpty(projects) && (
                        <>
                            <Button
                                variant="outlined"
                                onClick={onClickOpenProjectMenu}
                                sx={{ textTransform: 'capitalize' }}>
                                {selectedProject?.name || 'Select Project'}
                                <Icon>arrow_drop_down</Icon>
                            </Button>
                            <Menu
                                sx={{ marginTop: 1 }}
                                anchorEl={projectMenuAnchorEl}
                                open={projectMenuOpen}
                                onClose={() => onCloseProjectMenu()}>
                                {projects.map((x, i) => (
                                    <MenuItem
                                        key={i}
                                        sx={{ minWidth: '150px' }}
                                        onClick={() => onCloseProjectMenu(x)}>
                                        {x.name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    )}
                </Box>
            </PageHeader>
            {!!selectedProject && (
                <PaymentsTable selectedProjectID={selectedProject.id} />
            )}
        </Container>
    )
}

export default ProjectPayments
