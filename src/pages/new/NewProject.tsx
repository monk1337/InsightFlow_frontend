import { Button, Typography } from "@mui/material"
import ProjectNameStep from "./ProjectNameStep"
import ProjectConfigStep from "./ProjectConfigStep"
import { useEffect, useState } from "react";
import { useToastContext } from "@/context/ToastContext";
import { useNewProjectContext } from "./context/NewProjectContext";
import { useUserContext } from "@/context/userContext";
import { useNavigate } from "react-router-dom";

const STEP_NAME = [
	"Send OTP",
	"Next",
	"Create Project"
]

const NewProject = () => {
	const { setSnackbarData } = useToastContext();
	const { otpVerificationStatus, sendOtp, setLoggedUser, resetOtpStatus } = useUserContext()
	const { project, createProject } = useNewProjectContext();

	const naviage = useNavigate();

	const [stepCount, setStepCount] = useState(0);
	const [otp, setOtp] = useState("");
	const [mobileError, setMobileError] = useState("");

	const isOtpVerificationDone = stepCount == 1 && (otpVerificationStatus === 0 || otpVerificationStatus === -1)

	const handleStepChange = async (isNext: boolean) => {
		if(isNext && stepCount == 2){
			const res = await createProject();
			if(res) {
				setLoggedUser(project.adminMobile, "admin");
				resetOtpStatus();
				naviage("/");
			}
			return;
		}
		setStepCount(prev => (isNext ? prev + 1 : prev - 1));
	}

	const triggerSendOtp = async () => {
		const res = await sendOtp(project.adminMobile);
		res && setSnackbarData({message: "OTP sent to your mobile number", severity: "success"});
	}

	useEffect(() => {
		stepCount === 1 && triggerSendOtp();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stepCount])

	return (
		<div className='full-screen'>
			<div className="card w-[clamp(350px,70vw,600px)]">
				<Typography variant="h4" className='!mb-14 text-center'>
					Create Project
				</Typography>
				
				{stepCount <= 1 ? <ProjectNameStep otp={otp} showOtp={stepCount == 1} mobileError={mobileError} setMobileError={setMobileError} setOtp={setOtp} /> : <ProjectConfigStep /> }

				<div className="flex items-center justify-between mt-4">
					<Button onClick={handleStepChange.bind(null, false)} disabled={stepCount <= 1}>Prev</Button>
					<Button variant="contained" onClick={handleStepChange.bind(null, true)} disabled={isOtpVerificationDone || mobileError !== ""}>{STEP_NAME[stepCount]}</Button>
				</div>
			</div>
		</div>
	)
}

export default NewProject
