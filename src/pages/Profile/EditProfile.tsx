import { useEffect, useState } from 'react'
import get from 'lodash/get'
import {
    Grid,
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    Alert,
    Stack,
    Menu,
    MenuItem,
    IconButton,
    Icon,
} from '@mui/material'

import BasicCard from 'components/BasicCard'
import { UserData, updateUserData } from 'store/userSlice'
import { updateUser } from 'api/user'
import { useAppSelector, useAppDispatch } from 'hooks/reduxHooks'
import { updateSnackBar } from 'store/snackBarSlice'
import Enable2FADialog from './Enable2FADialog'
import TwoFactorRecoveryCodeDialog from './TwoFactorRecoveryCodeDialog'
import Disable2FADialog from './Disable2FADialog'
import Regenerate2FARecoveryCodeDialog from './Regenerate2FARecoveryCodeDialog'

interface EditProfileProps {
    userData: UserData
}

const EditProfile = ({ userData }: EditProfileProps) => {
    const dispatch = useAppDispatch()
    const user2FAEnabled = useAppSelector((state) => state.user2FA.isEnabled)
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        username: '',
        first_name: '',
        last_name: '',
        current_password: '',
        password: '',
    })
    const [formError, setFormError] = useState({
        username: '',
        first_name: '',
        last_name: '',
        current_password: '',
        password: '',
    })
    const [editProfileError, setEditProfileError] = useState('')
    const [user2FAEnableDialogShown, setShowUser2FAEnableDialog] =
        useState(false)
    const [user2FADisableDialogShown, setShowUser2FADisableDialog] =
        useState(false)
    const [user2FARecoveryCodes, setUser2FARecoveryCodes] = useState<string[]>(
        []
    )
    const [
        regenerate2FARecoveryCodeDialogShown,
        SetRegenerate2FARecoveryCodeDialogShown,
    ] = useState(false)
    const [actionMenuAnchorEl, setActionMenuAnchorEl] =
        useState<null | HTMLElement>(null)
    const actionMenuOpen = Boolean(actionMenuAnchorEl)

    useEffect(() => {
        setFormData({
            username: userData.username,
            first_name: userData.firstName,
            last_name: userData.lastName,
            current_password: '',
            password: '',
        })
    }, [userData])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value,
        }))
        const hasError = get(formError, event.target.id, '').length
        if (hasError) {
            setFormError((prevState) => ({
                ...prevState,
                [event.target.id]: '',
            }))
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const updateData: { [key: string]: string } = {}
        for (const data in formData) {
            if (formData[data].length) {
                updateData[data] = formData[data]
            }
        }
        updateUser(updateData).then((response) => {
            if (response.ok) {
                const userData: UserData = {
                    id: get(response.data, 'id', ''),
                    email: get(response.data, 'email', ''),
                    username: get(response.data, 'username', ''),
                    firstName: get(response.data, 'first_name', ''),
                    lastName: get(response.data, 'last_name', ''),
                    joinedOn: get(response.data, 'joined_on', ''),
                    isActive: get(response.data, 'is_active', false),
                    isVerified: get(response.data, 'is_verified', false),
                }
                setEditProfileError('')
                dispatch(updateUserData(userData))
                dispatch(
                    updateSnackBar({
                        severity: 'success',
                        message: 'Profile updated successfully',
                    })
                )
            } else {
                if (response.status === 422) {
                    setEditProfileError('')
                    const details = get(response.data, 'detail', {})
                    let formErrors = { ...formError }
                    for (const detail of details) {
                        formErrors = {
                            ...formErrors,
                            [detail.loc[1]]: detail.msg,
                        }
                    }
                    setFormError(formErrors)
                }
                if (response.status === 400) {
                    const detail = get(response.data, 'detail', {})
                    if (detail.code === 'UPDATE_USER_INVALID_PASSWORD') {
                        setEditProfileError(detail.reason)
                    }
                }
            }
        })
    }

    const showActionMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setActionMenuAnchorEl(event.currentTarget)
    }

    const hideActionMenu = () => {
        setActionMenuAnchorEl(null)
    }

    const onClickNewRecoveryCode = () => {
        hideActionMenu()
        SetRegenerate2FARecoveryCodeDialogShown(true)
    }

    return (
        <BasicCard>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" textAlign="center">
                    Edit Profile
                </Typography>
                <Divider
                    sx={{
                        mt: 2,
                        mx: 'auto',
                        width: '24px',
                        borderWidth: '3px',
                    }}
                />
                <Box
                    component="form"
                    noValidate
                    sx={{ mt: 1 }}
                    onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                error={!!formError.username}
                                helperText={formError.username}
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="first_name"
                                label="First Name"
                                name="firstName"
                                error={!!formError.first_name}
                                helperText={formError.first_name}
                                value={formData.first_name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="last_name"
                                label="Last Name"
                                name="lastName"
                                error={!!formError.last_name}
                                helperText={formError.last_name}
                                value={formData.last_name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="current_password"
                                label="Current Password"
                                name="currentPassword"
                                type="password"
                                error={!!formError.current_password}
                                helperText={formError.current_password}
                                value={formData.current_password}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="password"
                                label="New Password"
                                name="password"
                                type="password"
                                error={!!formError.password}
                                helperText={formError.password}
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    {!!editProfileError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {editProfileError}
                        </Alert>
                    )}
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            color={user2FAEnabled ? 'error' : 'success'}
                            sx={{ mr: 2 }}
                            onClick={
                                user2FAEnabled
                                    ? () => setShowUser2FADisableDialog(true)
                                    : () => setShowUser2FAEnableDialog(true)
                            }>
                            {user2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disableElevation
                            sx={{ mr: 2 }}>
                            Update
                        </Button>
                        {!!user2FAEnabled && (
                            <IconButton onClick={showActionMenu}>
                                <Icon>more_vert</Icon>
                            </IconButton>
                        )}
                    </Stack>
                </Box>
            </Box>
            {!!user2FAEnableDialogShown && (
                <Enable2FADialog
                    open={user2FAEnableDialogShown}
                    onClose={() => setShowUser2FAEnableDialog(false)}
                    setUser2FARecoveryCodes={setUser2FARecoveryCodes}
                />
            )}
            <Disable2FADialog
                open={user2FADisableDialogShown}
                onClose={() => setShowUser2FADisableDialog(false)}
            />
            <TwoFactorRecoveryCodeDialog
                codes={user2FARecoveryCodes}
                onClose={() => setUser2FARecoveryCodes([])}
            />
            {!!regenerate2FARecoveryCodeDialogShown && (
                <Regenerate2FARecoveryCodeDialog
                    open={regenerate2FARecoveryCodeDialogShown}
                    onClose={() =>
                        SetRegenerate2FARecoveryCodeDialogShown(false)
                    }
                    setUser2FARecoveryCodes={setUser2FARecoveryCodes}
                />
            )}
            {!!user2FAEnabled && (
                <Menu
                    anchorEl={actionMenuAnchorEl}
                    open={actionMenuOpen}
                    onClose={hideActionMenu}>
                    <MenuItem onClick={onClickNewRecoveryCode}>
                        Request new two factor recovery codes
                    </MenuItem>
                </Menu>
            )}
        </BasicCard>
    )
}

export default EditProfile
