import { apiBase, jsonAPI } from './base'
import { ProjectData } from 'store/projectsSlice'
import { PaymentData } from 'store/projectPaymentsSlice'

const prefix = '/client/projects'

export interface ProjectFormData {
    name: string
    domain_name: string
    is_non_profit?: boolean
    enabled_currency?: string[]
    webhook_url?: string
}

export interface ProjectStatsData {
    total_project: number
    active_project: number
    verified_domain: number
}

export interface ProjectPaymentData {
    payments: PaymentData[]
    total_payments?: number
}

export interface CreateProjectData extends ProjectData {
    api_key?: string
    payment_signature_secret?: string
}

export const getProjects = () => {
    return jsonAPI(apiBase).get<ProjectData[]>(prefix)
}

export const createProject = (data: ProjectFormData) => {
    return jsonAPI(apiBase).post<CreateProjectData>(prefix, data)
}

export const updateProject = (projectID: string, data: ProjectFormData) => {
    return jsonAPI(apiBase).patch<ProjectData>(`${prefix}/${projectID}`, data)
}

export const deleteProject = (projectID: string) => {
    return jsonAPI(apiBase).delete(`${prefix}/${projectID}`)
}

export const getProjectStats = () => {
    return jsonAPI(apiBase).get<ProjectStatsData>(`${prefix}/stats`)
}

export const getNewApiKey = (projectID: string) => {
    return jsonAPI(apiBase).get<string>(`${prefix}/${projectID}/new-api-key`)
}

export const getNewPaymentSignatureSecret = (projectID: string) => {
    return jsonAPI(apiBase).get<string>(
        `${prefix}/${projectID}/new-payment-signature-secret`
    )
}

export const getProjectsPayment = (
    projectID: string,
    limit?: number,
    pageNumber?: number,
    search?: string,
    currency_name?: string
) => {
    let url = `${prefix}/${projectID}/payments?limit=${
        limit || 5
    }&page-number=${pageNumber}`
    if (search) url += `&search=${search}`
    if (currency_name) url += `&currency_name=${currency_name}`
    return jsonAPI(apiBase).get<ProjectPaymentData>(url)
}
