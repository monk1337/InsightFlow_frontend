import { AxiosError, AxiosRequestConfig } from "axios";
import axiosClient from "../config.axios"

export const ENDPOINT = {
    auth: {
        login: "/auth/login",
        logout: "/auth/logout",
        sendOtp: "/send-otp",
        verifyOtp: "/verify-otp",
        verifyUser: "/verify-user"
    },
    project: {
        new: "/new"
    }
}

function AxiosConfig() {
    const get = async (endpoint: string, requestConfig?: AxiosRequestConfig) => {
        try {
            const res = await axiosClient.get(endpoint, requestConfig);
            return res
        }
        catch (err: unknown) {
            const axiosErr = err as AxiosError;
            return axiosErr.response;
        }
    }

    const post = async (endpoint: string, payload: object, requestConfig?: AxiosRequestConfig) => {
        try {
            const res = await axiosClient.post(endpoint, payload, requestConfig);
            return res
        }
        catch (err: unknown) {
            const axiosErr = err as AxiosError;
            return axiosErr.response;
        }
    }

    return { get, post };
}

export const axiosRequest = AxiosConfig();
