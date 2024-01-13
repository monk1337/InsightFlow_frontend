import { Alert, AlertColor, Snackbar } from "@mui/material";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

type SnackbarDataType = {
    message: string
    severity: AlertColor
}

type ToastContextType = {
    setSnackbarData: Dispatch<SetStateAction<SnackbarDataType>>
}

const INITIAL_VALUE: SnackbarDataType = {
    message: "",
    severity: "success"
}

const toastContext = createContext<ToastContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useToastContext = () => useContext(toastContext) as ToastContextType;

const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [snackbarData, setSnackbarData] = useState<SnackbarDataType>({...INITIAL_VALUE});
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {setSnackbarData(prev => ({...prev, message: ""}))}, 0);
    }

    useEffect(() => {
        setOpen(snackbarData.message ? true : false);
    }, [snackbarData.message])

    console.log(snackbarData)

    return (
        <toastContext.Provider value={{
            setSnackbarData
        }}>
            {children}
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbarData.severity} sx={{ width: '100%' }}>
                    {snackbarData.message}
                </Alert>
            </Snackbar>
        </toastContext.Provider>
    )
};

export default ToastProvider
