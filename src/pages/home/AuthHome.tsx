import { Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const AuthHome = () => {
    return (
        <div className='full-screen'>
            <div className='card'>
                <Typography variant="h3" className='!mb-14'>
                    InsightFlow
                </Typography>
                <div className='flex flex-col gap-4 items-center justify-center'>
                    <Link to="/login?role=recorder">
                        <Button variant='contained'>Login as Recorder</Button>
                    </Link>
                    <Link to="/login?role=reviewer">
                        <Button variant='outlined'>Login as Reviewer</Button>
                    </Link>
                    <div className='text-center mt-4'>
                        <div className='dark:text-dark-l-gray'>Don't have a Project</div>
                        <Link to="/new" className='dark:text-dark-accent underline'>Create Project</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthHome
