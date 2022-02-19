import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import find from 'lodash/find'

import { ProjectStatsData } from 'api/project'

export interface ProjectData {
    id: string
    name: string
    domain_name: string
    date_created: string
    is_non_profit?: boolean
    enabled_currency?: string[]
    webhook_url?: string
}

interface ProjectState {
    projects: ProjectData[]
    projectStats: ProjectStatsData
}

const initialState: ProjectState = {
    projects: [],
    projectStats: { active_project: 0, total_project: 0, verified_domain: 0 },
}

const increaseOrDecreaseActiveProject = (
    newState: ProjectData,
    editedProject?: ProjectData
) => {
    if (newState?.enabled_currency && newState?.enabled_currency?.length) {
        if (
            editedProject?.enabled_currency &&
            editedProject?.enabled_currency?.length
        ) {
            return 0
        } else {
            return 1
        }
    }
    if (
        editedProject?.enabled_currency &&
        editedProject?.enabled_currency?.length
    ) {
        return -1
    }
    return 0
}

// TODO: Check redux toolkit docs, state change feels unnatural
const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        updateProjects: (state, action: PayloadAction<ProjectData[]>) => {
            state.projects = action.payload
        },
        addProject: (state, action: PayloadAction<ProjectData>) => {
            state.projects.push(action.payload)
            state.projectStats = {
                ...state.projectStats,
                total_project: state.projectStats.total_project + 1,
                active_project:
                    action.payload.enabled_currency &&
                    action.payload.enabled_currency.length
                        ? state.projectStats.active_project + 1
                        : state.projectStats.active_project,
            }
        },
        editProject: (state, action: PayloadAction<ProjectData>) => {
            const editedProject = find(state.projects, {
                id: action.payload.id,
            })
            state.projects = state.projects.map((x) =>
                x.id === action.payload.id ? action.payload : x
            )
            state.projectStats = {
                ...state.projectStats,
                active_project:
                    state.projectStats.active_project +
                    increaseOrDecreaseActiveProject(
                        action.payload,
                        editedProject
                    ),
            }
        },
        deleteProject: (state, action: PayloadAction<string>) => {
            const deletedProject = find(state.projects, { id: action.payload })
            state.projects = state.projects.filter(
                (x) => x.id !== action.payload
            )
            state.projectStats = {
                ...state.projectStats,
                total_project: state.projectStats.total_project - 1,
                active_project: deletedProject?.enabled_currency?.length
                    ? state.projectStats.active_project - 1
                    : state.projectStats.active_project,
            }
        },
        updateProjectStats: (
            state,
            action: PayloadAction<ProjectStatsData>
        ) => {
            state.projectStats = action.payload
        },
    },
})

export const {
    updateProjects,
    addProject,
    editProject,
    deleteProject,
    updateProjectStats,
} = projectsSlice.actions
export default projectsSlice.reducer
