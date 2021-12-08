import { useEffect, useState } from 'react'
import { Typography, Container, Grid, Button, Box } from '@mui/material'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import { useMatomo } from '@datapunt/matomo-tracker-react'

import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks'
import {
    updateProjects,
    deleteProject as deleteProjectAction,
    updateProjectStats,
} from 'store/projectsSlice'
import { updatePayoutAddresses } from 'store/payoutAddressSlice'
import { updateSnackBar } from 'store/snackBarSlice'
import {
    getProjects,
    deleteProject,
    getProjectStats,
    getNewApiKey,
    getNewPaymentSignatureSecret,
} from 'api/project'
import { getPayoutAddresses } from 'api/payoutAddress'
import PageHeader from 'components/PageHeader'
import BasicCard from 'components/BasicCard'
import ProjectStats from './ProjectStats'
import ProjectForm from './ProjectForm'
import ProjectList from './ProjectList'
import ProjectDetails from './ProjectDetails'
import ApiKeyDialog from './ApiKeyDialog'

interface NoProjectProps {
    onClickNew: () => void
}

const NoProject = ({ onClickNew }: NoProjectProps) => {
    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} sm={8}>
                <BasicCard>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                        <Typography variant="body1" mb={2}>
                            It seems you have not created a project yet
                        </Typography>
                        <Button variant="outlined" onClick={onClickNew}>
                            Create new project
                        </Button>
                    </Box>
                </BasicCard>
            </Grid>
        </Grid>
    )
}

const Projects = () => {
    const projects = useAppSelector((state) => state.project.projects)
    const payoutAddresses = useAppSelector(
        (state) => state.payoutAddress.payoutAddresses
    )
    const projectStats = useAppSelector((state) => state.project.projectStats)
    const dispatch = useAppDispatch()
    const [projectFormOpen, setProjectFormOpen] = useState(false)
    const [projectFormType, setProjectFormType] = useState<'create' | 'update'>(
        'create'
    )
    const [selectedProjectID, setSelectedProjectID] = useState('')
    const [apiKey, setApiKey] = useState({
        apiKey: '',
        paymentSignatureSecret: '',
    })
    const selectedProject = find(projects, (x) => x.id === selectedProjectID)
    const { trackPageView } = useMatomo()

    useEffect(() => {
        trackPageView({})
    }, [trackPageView])

    useEffect(() => {
        if (isEmpty(payoutAddresses)) {
            getPayoutAddresses().then((response) => {
                if (response.ok) {
                    dispatch(updatePayoutAddresses(response.data || []))
                }
            })
        }
        if (isEmpty(projects)) {
            getProjects().then((response) => {
                if (response.ok) {
                    dispatch(updateProjects(response.data || []))
                }
            })
        }
        getProjectStats().then((response) => {
            if (response.ok && response.data) {
                dispatch(updateProjectStats(response.data))
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const openProjectForm = (formType: 'create' | 'update') => {
        setProjectFormOpen(true)
        setProjectFormType(formType)
    }

    const handleDeleteProject = () => {
        if (selectedProject) {
            deleteProject(selectedProject.id).then((response) => {
                if (response.ok) {
                    setSelectedProjectID('')
                    dispatch(deleteProjectAction(selectedProject.id))
                    dispatch(
                        updateSnackBar({
                            severity: 'success',
                            message: 'Project deleted successfully',
                        })
                    )
                }
            })
        }
    }

    const onClickGetNewApiKey = () => {
        if (selectedProject) {
            getNewApiKey(selectedProject.id).then((response) => {
                if (response.ok && response.data) {
                    setApiKey({
                        apiKey: response.data,
                        paymentSignatureSecret: '',
                    })
                }
            })
        }
    }

    const onClickGetNewPaymentSignatureSecret = () => {
        if (selectedProject) {
            getNewPaymentSignatureSecret(selectedProject.id).then(
                (response) => {
                    if (response.ok && response.data) {
                        setApiKey({
                            apiKey: '',
                            paymentSignatureSecret: response.data,
                        })
                    }
                }
            )
        }
    }

    const showProjectList = () => {
        setSelectedProjectID('')
    }

    return (
        <Container maxWidth="lg">
            <PageHeader>
                <Typography variant="h6" fontWeight="bold">
                    Projects
                </Typography>
            </PageHeader>
            {!!projectStats && <ProjectStats data={projectStats} />}
            {isEmpty(projects) ? (
                <NoProject onClickNew={() => openProjectForm('create')} />
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={5} md={4}>
                        <Box
                            sx={{
                                display: {
                                    xs: !selectedProject ? 'block' : 'none',
                                    sm: 'block',
                                },
                            }}>
                            <ProjectList
                                projects={projects}
                                selectedProjectID={selectedProjectID}
                                onClickNew={() => openProjectForm('create')}
                                onSelectProject={setSelectedProjectID}
                            />
                        </Box>
                    </Grid>
                    {!!selectedProject && (
                        <Grid item xs={12} sm={7} md={8}>
                            <ProjectDetails
                                selectedProject={selectedProject}
                                onClickUpdate={() => openProjectForm('update')}
                                handleDeleteProject={handleDeleteProject}
                                onClickNewApiKey={onClickGetNewApiKey}
                                showProjectList={showProjectList}
                                onClickNewPaymentSignatureSecret={
                                    onClickGetNewPaymentSignatureSecret
                                }
                            />
                        </Grid>
                    )}
                </Grid>
            )}
            <ProjectForm
                type={projectFormType}
                open={projectFormOpen}
                onClose={() => setProjectFormOpen(false)}
                payoutAddresses={payoutAddresses}
                projectData={
                    projectFormType === 'update' ? selectedProject : undefined
                }
                setApiKey={setApiKey}
            />
            <ApiKeyDialog
                open={
                    !!apiKey.apiKey.length ||
                    !!apiKey.paymentSignatureSecret.length
                }
                onClose={() =>
                    setApiKey({ apiKey: '', paymentSignatureSecret: '' })
                }
                apiKey={apiKey.apiKey}
                paymentSignatureSecret={apiKey.paymentSignatureSecret}
            />
        </Container>
    )
}

export default Projects
