import { useUserContext } from '@/context/userContext'
import { Alert } from '@mui/material';
import AuthHome from './AuthHome';

const Home = () => {
    const { isUserLogged } = useUserContext();

    return (
        <>
            <main>
                {!isUserLogged ?
                    <AuthHome /> :
                    <Alert severity='success'> Logged successfully</Alert>
                }
            </main>
        </>
    )
}

export default Home
