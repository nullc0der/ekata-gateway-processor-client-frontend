import React, { useState } from 'react'
import {
    Box,
    Typography,
    Grid,
    Stack,
    Chip,
    Button,
    Icon,
    IconButton,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    Menu,
    MenuItem,
} from '@mui/material'
import { format } from 'date-fns'

import { ProjectData } from 'store/projectsSlice'
import BasicCard from 'components/BasicCard'
import CopyToClipboard from 'components/CopyToClipboard'
import HelpTooltip from 'components/HelpTooltip'

interface ProjectDetailsProps {
    selectedProject?: ProjectData
    onClickUpdate: () => void
    handleDeleteProject: () => void
    onClickNewApiKey: () => void
    showProjectList: () => void
    onClickNewPaymentSignatureSecret: () => void
}

interface DeleteProjectDialogProps {
    open: boolean
    toggleDeleteDialog: () => void
    deleteProject: () => void
}

const DeleteProjectDialog = ({
    open,
    toggleDeleteDialog,
    deleteProject,
}: DeleteProjectDialogProps) => {
    return (
        <Dialog open={open} onClose={toggleDeleteDialog}>
            <DialogContent>
                <DialogContentText>
                    Deleting this project will disable assosicating payment
                    form, do you want to proceed ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={toggleDeleteDialog}>
                    Cancel
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={deleteProject}
                    startIcon={<Icon>delete</Icon>}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const ProjectDetails = ({
    selectedProject,
    onClickUpdate,
    handleDeleteProject,
    onClickNewApiKey,
    showProjectList,
    onClickNewPaymentSignatureSecret,
}: ProjectDetailsProps) => {
    const hasEnabledCurrency = selectedProject?.enabled_currency?.length
    const [showDeleteProjectDialog, setShowDeleteProjectDialog] =
        useState(false)
    const [actionMenuAnchorEl, setActionMenuAnchorEl] =
        useState<null | HTMLElement>(null)
    const actionMenuOpen = Boolean(actionMenuAnchorEl)

    const toggleDeleteDialog = () => {
        setShowDeleteProjectDialog(!showDeleteProjectDialog)
    }

    const onClickDelete = () => {
        handleDeleteProject()
        toggleDeleteDialog()
    }

    const showActionMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setActionMenuAnchorEl(event.currentTarget)
    }

    const hideActionMenu = () => {
        setActionMenuAnchorEl(null)
    }

    return selectedProject ? (
        <BasicCard>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}>
                <Box
                    sx={{
                        position: 'absolute',
                        left: '-20px',
                        top: '-5px',
                        display: { sm: 'none' },
                    }}>
                    <IconButton onClick={showProjectList}>
                        <Icon>arrow_back</Icon>
                    </IconButton>
                </Box>
                <Stack
                    direction="row"
                    sx={{
                        position: 'absolute',
                        top: hasEnabledCurrency ? '-10px' : '-20px',
                        right: '-10px',
                        alignItems: 'center',
                    }}>
                    {selectedProject.is_non_profit && (
                        <Chip
                            label="Non Profit Project"
                            color="success"
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                        />
                    )}
                    <Chip
                        label={hasEnabledCurrency ? 'Active' : 'Inactive'}
                        color={hasEnabledCurrency ? 'success' : 'warning'}
                        size="small"
                        variant="outlined"
                    />
                    {!hasEnabledCurrency && (
                        <HelpTooltip title="You need to enable currency to activate a project" />
                    )}
                </Stack>
                <Typography variant="h6" textAlign="center">
                    {selectedProject.name}
                </Typography>
                <Grid container mt={3} justifyContent="space-evenly">
                    <Grid item xs={12} sm={4}>
                        <Typography>Project ID</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Stack direction="row" spacing={1}>
                            <Typography variant="body2" lineHeight={2}>
                                {selectedProject.id}
                            </Typography>
                            <CopyToClipboard text={selectedProject.id} />
                        </Stack>
                    </Grid>
                </Grid>
                <Grid container mt={3} justifyContent="space-evenly">
                    <Grid item xs={12} sm={4}>
                        <Typography>Domain Name</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="body2" lineHeight={2}>
                            {selectedProject.domain_name}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container mt={3} justifyContent="space-evenly">
                    <Grid item xs={12} sm={4}>
                        <Typography>Date Created</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="body2" lineHeight={2}>
                            {format(
                                new Date(selectedProject.date_created),
                                'dd/MM/Y'
                            )}
                        </Typography>
                    </Grid>
                </Grid>
                {!!hasEnabledCurrency && (
                    <Grid container mt={3} justifyContent="space-evenly">
                        <Grid item xs={12} sm={4}>
                            <Typography>Enabled Currencies</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            {selectedProject.enabled_currency?.map((x, i) => (
                                <Typography
                                    variant="body2"
                                    lineHeight={2}
                                    key={i}>
                                    {x}
                                </Typography>
                            ))}
                        </Grid>
                    </Grid>
                )}
                {!!selectedProject.webhook_url?.length && (
                    <Grid container mt={3} justifyContent="space-evenly">
                        <Grid item xs={12} sm={4}>
                            <Typography>Webhook URL</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography variant="body2" lineHeight={2}>
                                {selectedProject.webhook_url}
                            </Typography>
                        </Grid>
                    </Grid>
                )}
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={onClickUpdate}
                        startIcon={<Icon>check</Icon>}>
                        Update
                    </Button>
                    <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={toggleDeleteDialog}>
                        <Icon>delete</Icon>
                    </IconButton>
                    <IconButton onClick={showActionMenu}>
                        <Icon>more_vert</Icon>
                    </IconButton>
                </Stack>
            </Box>
            <DeleteProjectDialog
                open={showDeleteProjectDialog}
                toggleDeleteDialog={toggleDeleteDialog}
                deleteProject={onClickDelete}
            />
            <Menu
                anchorEl={actionMenuAnchorEl}
                open={actionMenuOpen}
                onClose={hideActionMenu}>
                <MenuItem onClick={onClickNewApiKey}>
                    Request new api key
                </MenuItem>
                <MenuItem onClick={onClickNewPaymentSignatureSecret}>
                    Request new payment signature secret
                </MenuItem>
            </Menu>
        </BasicCard>
    ) : null
}

export default ProjectDetails
