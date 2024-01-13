import { Button, CircularProgress, TextField } from "@mui/material"
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNewProjectContext } from "./context/NewProjectContext";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { getPendingTime, isValidMobile } from "@/utils/utils";
import { useUserContext } from "@/context/userContext";

type ProjectNameStepPropsType = {
    otp: string
    showOtp: boolean
    mobileError: string
    setOtp: Dispatch<SetStateAction<string>>
    setMobileError: Dispatch<SetStateAction<string>>
}

const ProjectNameStep = ({ otp, showOtp, mobileError, setMobileError, setOtp }: ProjectNameStepPropsType) => {
    const { resendTimestamp, serverOtp, otpVerificationStatus, loading, sendOtp, verifyOtp } = useUserContext()
	const { project, setProject} = useNewProjectContext();
    
    // const [disableOtp, setDisableOtp] = useState(false);
    const [isResend, setResend] = useState(false);
    const [resendTime, setResendTime] = useState({
        minutesDifference: 0,
        secondsDifference: 0
    })

    const intervalIdRef = useRef<NodeJS.Timeout>();

    const handleVerifyOtp = async () => {
        const res = await verifyOtp(project.adminMobile, otp);
        !res && setOtp("")
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
        if(otp.length > 4) {
            setOtp(otp => (otp.slice(0, 5)));
        }

        otp.length === 4 && handleVerifyOtp();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp])

    return (
        <div className='flex flex-col gap-4'>
            
            <TextField
                className='w-full'
                label="Project Name"
                variant="filled"
                value={project.projectName}
                onChange={(e) => {setProject(prev => ({...prev, projectName: e.target.value}))}}
                name='projectName'
                InputProps={{
                    disableUnderline: true,
                }}
                required
            />
            <TextField
                className='w-full'
                label="Admin Name"
                variant="filled"
                value={project.adminName}
                onChange={(e) => {setProject(prev => ({...prev, adminName: e.target.value}))}}
                name='adminName'
                InputProps={{
                    disableUnderline: true,
                }}
                required
            />
            <TextField
                className='w-full'
                label="Admin Mobile"
                value={project.adminMobile}
                onChange={(e) => {
                    setMobileError(isValidMobile(e.target.value) ? "" : "Invalid Mobile Number")
                    setProject(prev => ({...prev, adminMobile: e.target.value}))
                }}
                variant="filled"
                name='adminMobile'
                type="number"
                disabled={showOtp}
                InputProps={{
                    disableUnderline: true,
                }}
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
                        value={otp}
                        onChange={(e) => {setOtp(e.target.value)}}
                        type='password'
                        disabled={loading.verify || otpVerificationStatus === 1}
                        error={otpVerificationStatus === -1}
                        helperText={otpVerificationStatus === -1 ? "Invalid OTP" : ""}
                        InputProps={{
                            disableUnderline: true,
                            endAdornment: (
                                <>
                                    {loading.verify && <CircularProgress size={20} />}
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
                            <Button disabled={!isResend} onClick={sendOtp.bind(null, project.adminMobile)}>Resend OTP</Button>
                            <span className="ml-1">{resendTime.minutesDifference < 10 ? `0${resendTime.minutesDifference}` : resendTime.minutesDifference}:{resendTime.secondsDifference < 10 ? `0${resendTime.secondsDifference}` : resendTime.secondsDifference}</span>
                        </div>
                    }
                    <div>OTP (will be removed): {serverOtp}</div>
                </div>
            }
        </div>
    )
}

export default ProjectNameStep
