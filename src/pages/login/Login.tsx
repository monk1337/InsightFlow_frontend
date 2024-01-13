import { useEffect, useRef, useState } from 'react'
import { UserRoleType, useUserContext } from '@/context/userContext'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPendingTime, isValidMobile } from '@/utils/utils';
import { useToastContext } from '@/context/ToastContext';
import { ENDPOINT, axiosRequest } from '@/api/apiUtils';

export const Login = () => {
	const { setSnackbarData } = useToastContext();
    const { isUserLogged, resendTimestamp , serverOtp, otpVerificationStatus, loading: userLoading, login, sendOtp, verifyOtp } = useUserContext()
    
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams()

    const [stepCount, setStepCount] = useState(0);
    const [isResend, setResend] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState({
        verify: false,
        login: false
    })
    const [inputObj, setInputObj] = useState({
        "mobile": "",
        "otp": ""
    });
    const [mobileError, setMobileError] = useState("");
    
    const role = searchParams.get("role") as UserRoleType;

    const handleStepChange = async () => {
        let changeNext = false;
        
        if(stepCount == 0)
            changeNext = await triggerSendOtp();
        if(stepCount == 1){
            await login(inputObj.mobile, role);
        }
        
        changeNext && setStepCount(prev => prev + 1);
    }

    const [resendTime, setResendTime] = useState({
        minutesDifference: 0,
        secondsDifference: 0
    })

    const intervalIdRef = useRef<NodeJS.Timeout>();

    const verifyUserRole = async () => {
        const payload = {
            mobile: inputObj.mobile,
            role
        }
        const res = await axiosRequest.post(ENDPOINT.auth.verifyUser, payload)

        if(res?.status === 200)
            return true;

        setSnackbarData({message: res?.data.detail.message, severity: "error"});
        return false;

    }

    const triggerSendOtp = async () => {
        setLoading(prev => ({...prev, verify: true}))

        const isUserHasProject = await verifyUserRole();

        if(!isUserHasProject){
            setLoading(prev => ({...prev, verify: false}))
            return false;
        }

		const res = await sendOtp(inputObj.mobile);
		res && setSnackbarData({message: "OTP sent to your mobile number", severity: "success"});
        setShowOtp(true);
        setLoading(prev => ({...prev, verify: false}))
        return res;
	}

    const handleVerifyOtp = async () => {
        const res = await verifyOtp(inputObj.mobile, inputObj.otp);
        !res && setInputObj(prev => ({...prev, otp: ""}))
    }

    useEffect(() => {
        if(resendTimestamp === null)
            return;

        if(resendTimestamp < Date.now()){
            setResend(true);
            return;
        }

        setResend(false);

        intervalIdRef.current = setInterval(() => {
            if(resendTimestamp < Date.now()){
                setResend(true)
                clearInterval(intervalIdRef.current);
                return;
            }
            setResendTime(getPendingTime(resendTimestamp))
        }, 800)
        
    }, [resendTimestamp])

    useEffect(() => {
        if(inputObj.otp.length > 4) {
            setInputObj(prev => ({...prev, otp: prev.otp.slice(0, 5)}));
        }

        inputObj.otp.length === 4 && handleVerifyOtp();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputObj.otp])

    useEffect(() => {
        if(role === "recorder" || role === "reviewer")
            return;

        setSearchParams(params => {
            params.set("role", "recorder");
            return params;
        })
    }, [role, setSearchParams]);

    useEffect(() => {
        console.log("fd")
        if(!isUserLogged)
            return;

        navigate("/");
        
    }, [isUserLogged, navigate])

    return (
        <div className='full-screen'>
            <div className="card w-[clamp(350px,70vw,600px)]">
                <Typography variant="h4" className='!mb-14 text-center'>
                    Welcome {role?.at(0)?.toUpperCase()}{role?.substring(1)}!
                </Typography>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleStepChange();
                }}>
                    <div className='flex flex-col gap-4'>
                        <TextField
                            className='w-full'
                            label="Mobile"
                            variant="filled"
                            name='adminMobile'
                            type="number"
                            value={inputObj.mobile}
                            onChange={(e) => {
                                setMobileError(isValidMobile(e.target.value) ? "" : "Invalid Mobile Number")
                                setInputObj(prev => ({...prev, mobile: e.target.value}));
                            }}  
                            InputProps={{
                                disableUnderline: true,
                            }}
                            disabled={showOtp}
                            error={mobileError !== ""}
                            helperText={mobileError}
                            required
                        />
                        {
                            showOtp &&
                            <div>
                                <TextField
                                    className='w-full !mt-4'
                                    label="OTP"
                                    variant="filled"
                                    name='otp'
                                    value={inputObj.otp}
                                    onChange={(e) => {setInputObj(prev => ({...prev, otp: e.target.value}))}}
                                    type='password'
                                    disabled={userLoading.verify || otpVerificationStatus === 1}
                                    error={otpVerificationStatus === -1}
                                    helperText={otpVerificationStatus === -1 ? "Invalid OTP" : ""}
                                    InputProps={{
                                        disableUnderline: true,
                                        endAdornment: (
                                            <>
                                                {userLoading.verify && <CircularProgress size={20} />}
                                                {otpVerificationStatus === -1 && <ErrorOutlineIcon className="text-danger" />}
                                                {otpVerificationStatus === 1 && <CheckCircleOutlineIcon className="text-success" />}
                                            </>
                                        )
                                    }}
                                    required
                                />
                                {
                                    otpVerificationStatus !== 1 &&
                                    <div className="mt-1">
                                        <Button disabled={!isResend} onClick={handleStepChange}>Resend OTP</Button>
                                        <span className="ml-1">{resendTime.minutesDifference < 10 ? `0${resendTime.minutesDifference}` : resendTime.minutesDifference}:{resendTime.secondsDifference < 10 ? `0${resendTime.secondsDifference}` : resendTime.secondsDifference}</span>
                                    </div>
                                }
                                <div>OTP (will be removed): {serverOtp}</div>
                            </div>
                        }
                        <Button variant="contained" type='submit' disabled={(isResend || stepCount == 1 && otpVerificationStatus !== 1)}>{stepCount == 0 ? "Send OTP" : "Login"}{loading.verify && <CircularProgress size={12} className='ml-2 dark:!text-dark-primary' />} </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
