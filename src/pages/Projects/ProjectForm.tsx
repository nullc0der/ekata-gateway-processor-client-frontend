import { useEffect, useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Switch,
    TextField,
} from '@mui/material'
import get from 'lodash/get'
import { ApiResponse } from 'apisauce'

import {
    createProject,
    CreateProjectData,
    ProjectFormData,
    updateProject,
} from 'api/project'
import { ProjectData, addProject, editProject } from 'store/projectsSlice'
import { updateSnackBar } from 'store/snackBarSlice'
import { PayoutAddressData } from 'store/payoutAddressSlice'
import { useAppDispatch } from 'hooks/reduxHooks'

interface ProjectsFormProps {
    type: 'create' | 'update'
    open: boolean
    onClose: () => void
    projectData?: ProjectData
    payoutAddresses: PayoutAddressData[]
    setApiKey: ({
        apiKey,
        paymentSignatureSecret,
    }: {
        apiKey: string
        paymentSignatureSecret: string
    }) => void
}

const initialFormData = {
    name: '',
    domain_name: '',
    webhook_url: '',
    enabled_currency: [],
}

const initialFormError = {
    name: '',
    domain_name: '',
    webhook_url: '',
    enabled_currency: '',
    other_error: '',
}

const ProjectForm = ({
    type,
    open,
    onClose,
    projectData,
    payoutAddresses,
    setApiKey,
}: ProjectsFormProps) => {
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState<ProjectFormData>(initialFormData)
    const [formError, setFormError] = useState(initialFormError)

    useEffect(() => {
        if (type === 'update') {
            if (projectData) {
                setFormData(projectData)
            }
        }
        if (type === 'create') {
            setFormData(initialFormData)
        }
    }, [projectData, type])

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value,
        }))
    }

    const handleSelectChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        value: string
    ) => {
        let enabled_currency = formData.enabled_currency || []
        enabled_currency = event.target.checked
            ? [...enabled_currency, value]
            : enabled_currency.filter((x) => x !== value)
        setFormData((prevState) => ({
            ...prevState,
            enabled_currency,
        }))
    }

    const handleResponse = (
        response: ApiResponse<ProjectData | CreateProjectData>
    ) => {
        if (response.ok) {
            setFormData(initialFormData)
            setFormError(initialFormError)
            if (response.data) {
                if (type === 'create') {
                    const responseData = response.data as CreateProjectData
                    const apiKey = responseData.api_key
                    const paymentSignatureSecret =
                        responseData.payment_signature_secret
                    delete responseData['api_key']
                    delete responseData['payment_signature_secret']
                    dispatch(addProject(responseData))
                    dispatch(
                        updateSnackBar({
                            severity: 'success',
                            message: 'Project created',
                        })
                    )
                    onClose()
                    setApiKey({
                        apiKey: apiKey || '',
                        paymentSignatureSecret: paymentSignatureSecret || '',
                    })
                }
                if (type === 'update') {
                    dispatch(editProject(response.data))
                    dispatch(
                        updateSnackBar({
                            severity: 'success',
                            message: 'Project updated',
                        })
                    )
                    onClose()
                }
            }
        } else {
            if (response.status === 422) {
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
        }
    }

    const handleSubmit = () => {
        const submitData = { ...formData }
        const submitDataKeys = Object.keys(submitData) as Array<
            keyof typeof submitData
        >
        submitDataKeys.forEach(
            (key) => !submitData[key]?.length && delete submitData[key]
        )
        if (type === 'create') {
            createProject(submitData).then((response) =>
                handleResponse(response)
            )
        }
        if (type === 'update' && projectData) {
            updateProject(projectData?.id, submitData).then((response) =>
                handleResponse(response)
            )
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {type === 'create' ? 'Create New Project' : 'Update Project'}
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin="normal"
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    value={formData.name}
                    error={!!formError.name}
                    helperText={formError.name}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="domain_name"
                    label="Domain Name"
                    name="domainName"
                    type="url"
                    value={formData.domain_name}
                    error={!!formError.domain_name}
                    helperText={formError.domain_name}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="webhook_url"
                    label="Webhook URL"
                    name="webhookURL"
                    type="url"
                    value={formData.webhook_url || ''}
                    error={!!formError.webhook_url}
                    helperText={formError.webhook_url}
                    onChange={handleInputChange}
                />
                <FormGroup sx={{ mt: 1 }}>
                    <FormLabel component="legend">Enabled Currency</FormLabel>
                    {payoutAddresses.map((x, i) => (
                        <FormControlLabel
                            key={i}
                            control={
                                <Switch
                                    checked={
                                        formData.enabled_currency
                                            ? formData.enabled_currency?.indexOf(
                                                  x.currency_name
                                              ) > -1
                                            : false
                                    }
                                    onChange={(e) =>
                                        handleSelectChange(e, x.currency_name)
                                    }
                                />
                            }
                            label={x.currency_name}
                        />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="outlined" onClick={handleSubmit}>
                    {type === 'create' ? 'Create' : 'Update'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProjectForm
