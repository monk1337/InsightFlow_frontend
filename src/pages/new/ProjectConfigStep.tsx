import { Add as AddIcon, Dataset, Delete, Person as PersonIcon, Settings as SettingsIcon } from '@mui/icons-material'
import { IconButton, TextField, Typography } from '@mui/material'
import { useNewProjectContext } from './context/NewProjectContext'
import { ChangeEvent, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { isValidMobile } from '@/utils/utils';

const FILE_TYPES = ["csv", "json"];

const ProjectConfigStep = () => {
    const { project, setProject, addUser: addUserToProject } = useNewProjectContext();

    const [inputObj, setInputObj] = useState({
        recorder: "",
        reviewer: ""
    });

    const [error, setError] = useState({
        recorder: "",
        reviewer: ""
    })

    const isMobileExist = (mobile: string, type: "recorder" | "reviewer") => {
        return project.adminMobile === mobile || project[type].some(user => user.mobile === mobile)
    }

    const handleFileChange = (file: File) => {
        setProject(prev => ({...prev, dataset: file}));
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const mobile = e.target.value;
        const type = e.target.name as "recorder" | "reviewer"
        setInputObj(prev => ({...prev, [type]: e.target.value}));

        if(isValidMobile(mobile) && isMobileExist(mobile, type)) {
            setError(prev => ({...prev, [type]: "Mobile Already Exists"}))
        }
        else if(!isValidMobile(mobile))
            setError(prev => ({...prev, [type]: "Invalid Mobile Number"}));
        else
            setError(prev => ({...prev, [type]: ""}));

    }

    const addUser = (type: "recorder" | "reviewer") => {
        if(inputObj[type] === "" || error[type] !== "")
            return;
        addUserToProject(type, inputObj[type])
        setInputObj(prev => ({...prev, [type]: ""}));
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center justify-start gap-4'>
                    <PersonIcon />
                    <Typography variant="h6">Add Users</Typography>
                </div>
                <TextField
                    className='w-full'
                    label="Add Recorder Mobile"
                    variant="filled"
                    value={inputObj.recorder}
                    name='recorder'
                    type="number"
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if(e.key !== "Enter")
                         return;
                        addUser("recorder")
                    }}
                    InputProps={{
                        disableUnderline: true,
                        endAdornment: (
                            <IconButton onClick={addUser.bind(null, "recorder")}>
                                <AddIcon />
                            </IconButton>
                        )
                    }}
                    error={error.recorder !== ""}
                    helperText={error.recorder}
                />
                {project.recorder.length !== 0 && <ShowAddedUser type='recorder' />}
                <TextField
                    className='w-full'
                    label="Add Reviewer Mobile"
                    variant="filled"
                    name='reviewer'
                    value={inputObj.reviewer}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if(e.key !== "Enter")
                         return;
                        addUser("reviewer")
                    }}
                    type="number"
                    InputProps={{
                        disableUnderline: true,
                        endAdornment: (
                            <IconButton onClick={addUser.bind(null, "reviewer")}>
                                <AddIcon />
                            </IconButton>
                        )
                    }}
                    error={error.reviewer !== ""}
                    helperText={error.reviewer}
                />
                {project.reviewer.length !== 0 && <ShowAddedUser type='reviewer' />}
            </div>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center justify-start gap-4'>
                    <SettingsIcon />
                    <Typography variant="h6">Project Settings</Typography>
                </div>
                <TextField
                    className='w-full'
                    label="Points Per Reviewing"
                    variant="filled"
                    type='number'
                    name='pointsPerReviewing'
                    value={project.reviewPoints}
                    onChange={(e) => {setProject(prev => ({...prev, reviewPoints: +e.target.value}))}}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    required
                />
                <TextField
                    className='w-full'
                    label="Points Per Recording"
                    variant="filled"
                    type='number'
                    name='pointsPerRecording'
                    value={project.recordPoints}
                    onChange={(e) => {setProject(prev => ({...prev, recordPoints: +e.target.value}))}}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    required
                />
            </div>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center justify-start gap-4'>
                    <Dataset />
                    <Typography variant="h6">Datasets</Typography>
                </div>
                <FileUploader handleChange={handleFileChange} file={project.dataset} name="file" types={FILE_TYPES} classes="file-uploader" />
                {project.dataset && <span>{project.dataset.name}</span>}
            </div>
        </div>
    )
}

const ShowAddedUser = ({ type }: { type: "recorder" | "reviewer" }) => {
    const { project, deleteUser } = useNewProjectContext();

    return (
        <div className='card dark:bg-dark-secondary !rounded-[.25rem] flex flex-col items-stretch justify-start gap-2'>
            {
                project[type].map(user => (
                    <div className='grid grid-cols-5 items-center' key={user.name}>
                        <div className='col-span-2'>{user.name}</div>
                        <div className='col-span-2'>{user.mobile}</div>
                        <div className='flex items-center justify-end'>
                            <IconButton onClick={deleteUser.bind(null, type, user.name)}>
                                <Delete className='text-danger/80' />
                            </IconButton>
                        </div>
                    </div>        
                ))
            }
        </div>
    )
}

export default ProjectConfigStep
