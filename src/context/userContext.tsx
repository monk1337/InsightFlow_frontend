import { ENDPOINT, axiosRequest } from "@/api/apiUtils";
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

export type UserRoleType = "admin" | "recorder" | "reviewer"

type UserType = {
    mobile: string
    role: UserRoleType
}

type LoadingType = {
    verify: boolean
    login: boolean
}

type UserContextType = {
    isUserLogged: boolean
    user: UserType | null
    resendTimestamp: number | null
    otpVerificationStatus: -1 | 0 | 1
    loading: LoadingType

    serverOtp: string // Todo: remove it

    login: (mobile: string, role: UserRoleType) => Promise<void>
    sendOtp: (mobile: string) => Promise<boolean>
    verifyOtp: (mobile: string, otp: string) => Promise<boolean>
    logout: () => Promise<void>
    setLoggedUser: (mobile: string, role: UserRoleType) => void
}


const userContext = createContext<UserContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => { return useContext(userContext) as UserContextType; } 

const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [isUserLogged, setUserLogged] = useState(false);
    const [user, setUser] = useState<UserType | null>(null);
    const [otpVerificationStatus, setOtpVerificationStatus] = useState<UserContextType["otpVerificationStatus"]>(0);
    const [resendTimestamp, setResendTimestamp] = useState<number | null>(null);
    const [loading, setLoading] = useState<UserContextType["loading"]>({
        login: false,
        verify: false
    })

    const [serverOtp, setServerOtp] = useState(""); // Todo: Remove it

    const login: UserContextType["login"] = async (mobile, role) => {
        const payload = {mobile, role};
        const res = await axiosRequest.post(ENDPOINT.auth.login, payload);

        if(res?.status !== 200)
            return;

        setLoggedUser(mobile, role);

    }

    const sendOtp: UserContextType["sendOtp"] = async (mobile) => {
        const payload = {
            mobile
        }
        const res = await axiosRequest.post(ENDPOINT.auth.sendOtp, payload);

        if(res?.status !== 200){
            if(res?.status === 400)
                setResendTimestamp(res.data.detail["resend_timestamp"]);
            return false
        }

        setServerOtp(res.data.otp);
        setResendTimestamp(res.data["resend_timestamp"]);
        return true
    }

    const verifyOtp: UserContextType["verifyOtp"] = async (mobile, otp) => {
        setLoading(prev => ({...prev, verify: true}));
        const payload = {
            mobile,
            otp
        }

        const res = await axiosRequest.post(ENDPOINT.auth.verifyOtp, payload);

        if(res?.status === 400) {
            setOtpVerificationStatus(-1);
            setLoading(prev => ({...prev, verify: false}));
            return false;
        }

        setOtpVerificationStatus(1);
        setLoading(prev => ({...prev, verify: false}));
        return true;
    }

    const setLoggedUser: UserContextType["setLoggedUser"] = (mobile, role) => {
        setUser({mobile, role});
        setUserLogged(true)
    }

    const verifyLogin = useCallback(async () => {
        const res = await axiosRequest.get(ENDPOINT.auth.login);
        if(res?.status !== 200)
            return;
        setLoggedUser(res.data.mobile, res.data.role);
    }, []);

    const logout: UserContextType["logout"] = async () => {
        const res = await axiosRequest.get(ENDPOINT.auth.logout);
        if(res?.status !== 200)
            return;

        setUser(null);
        setUserLogged(false);
        
    }

    useEffect(() => {
        verifyLogin();
    }, [verifyLogin])

    return (
        <userContext.Provider value={{
            isUserLogged: isUserLogged,
            user,
            otpVerificationStatus,
            resendTimestamp,
            loading,

            serverOtp,

            login,
            logout,
            sendOtp,
            verifyOtp,
            setLoggedUser
            // signup,
            // login,
            // logout
        }}>
            {children}
        </userContext.Provider>
    )
}

export default UserContextProvider
