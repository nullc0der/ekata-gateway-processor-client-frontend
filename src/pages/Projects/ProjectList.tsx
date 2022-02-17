import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    Button,
} from '@mui/material'

import BasicCard from 'components/BasicCard'
import { ProjectData } from 'store/projectsSlice'

interface ProjectListProps {
    projects: ProjectData[]
    selectedProjectID?: string
    onClickNew: () => void
    onSelectProject: (projectID: string) => void
}

const ProjectList = ({
    projects,
    onClickNew,
    selectedProjectID,
    onSelectProject,
}: ProjectListProps) => {
    return (
        <BasicCard>
            <List disablePadding>
                {projects.map((x, i) => (
                    <ListItem
                        key={i}
                        disablePadding
                        selected={selectedProjectID === x.id}
                        sx={{
                            borderRadius: 2,
                        }}>
                        <ListItemButton
                            sx={{
                                borderRadius: 2,
                            }}
                            onClick={() => onSelectProject(x.id)}>
                            <ListItemText primary={x.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Stack direction="row" justifyContent="center">
                <Button variant="outlined" sx={{ mt: 2 }} onClick={onClickNew}>
                    Add New
                </Button>
            </Stack>
        </BasicCard>
    )
}

export default ProjectList
