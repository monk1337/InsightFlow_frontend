/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, IconButton, InputAdornment, TextField } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type AuthProps = {
    isSignup: boolean
}

const Auth = ({ isSignup }: AuthProps) => {

    const [showPassword, setShowPassword] = useState(false);

    const [input, setInput] = useState({
        phone: "",
        password: "",
        ...(isSignup && {confirmPassword: ""})
    });

    const [error, setError] = useState({
        phone: "",
        password: ""
    });

    const handleChange = (e: any) => {
        setInput(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    }

    const validatePasswordAndConfirmPassword = () => {
        if(!input.confirmPassword || !input.password){
            setError(prev => ({...prev, password: ""}));
            return;
        }

        setError(prev => ({...prev, password: input.confirmPassword !== input.password ? "Confirm password does not match password" : ""}));
    }

    const validatePhone = () => {
        if(!input.phone) {
            setError(prev => ({...prev, phone: ""}));
            return;
        }

        setError(prev => ({...prev, phone: input.phone.length !== 10 ? "Invalid Phone Number" : ""}))
    }

    useEffect(() => {
        validatePasswordAndConfirmPassword();
        validatePhone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input])

    return (
        <div className='full-h flex items-center justify-center'>
            <form className='border p-4 rounded-md'>
                <h1 className='mb-4 text-center'>{isSignup ? "Signup" : "Login"}</h1>
                <div className='flex flex-col items-center justify-start gap-4'>
                    <TextField
                        className='w-full'
                        id="mobile-no"
                        label="Phone Number"
                        variant="outlined"
                        type='number'
                        value={input.phone}
                        name='phone'
                        onChange={handleChange}
                        error={error.phone ? true : false}
                        helperText={error.phone}
                    />
                    <TextField
                        id="password"
                        className='w-full'
                        label="Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <IconButton onClick={togglePassword}>
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        value={input.password}
                        name='password'
                        onChange={handleChange}
                    />
                    {
                        isSignup &&
                        <TextField
                            id="confirm-password"
                            className='w-full'
                            label="Re-Password"
                            variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton onClick={togglePassword}>
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            value={input.confirmPassword}
                            name='confirmPassword'
                            onChange={handleChange}
                            error={error.password ? true : false}
                            helperText={error.password}
                        />
                    }
                    <p className=' text-gray-400'>
                        {
                            isSignup ?
                            <>
                                Already have an Account? <Link className='text-blue-500' to="/login">Login</Link>
                            </>:
                            <>
                                Don't have an Account? <Link className='text-blue-500' to="/signup">Signup</Link>
                            </>

                        }
                    </p>
                    <Button fullWidth variant="contained">{isSignup ? "Signup" : "Login"}</Button>
                </div>
            </form>
        </div>
    )
}

export default Auth
