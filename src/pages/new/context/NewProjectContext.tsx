import { ENDPOINT, axiosRequest } from "@/api/apiUtils";
import { AxiosRequestConfig } from "axios";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useRef, useState } from "react";

type ProjectUserType = {
    name: string
    mobile: string
}

type ProjectType = {
    projectName: string
    adminName: string
    adminMobile: string
    recorder: ProjectUserType[]
    reviewer: ProjectUserType[]
    reviewPoints: number
    recordPoints: number
    dataset: File | null
}

type ProjectLoadingType = {
    create: boolean
}

type NewProjectContextType = {
    project: ProjectType
    loading: ProjectLoadingType
    setProject: Dispatch<SetStateAction<ProjectType>>
    addUser: (type: "recorder" | "reviewer", mobile: string) => void
    deleteUser: (type: "recorder" | "reviewer", name: string) => void
    createProject: () => Promise<boolean>
}

const newProjectContext = createContext<NewProjectContextType | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useNewProjectContext = () => useContext(newProjectContext) as NewProjectContextType;

const createFormData = (project: ProjectType): FormData => {
    const formData = new FormData();
    formData.append("file", project.dataset as File)
    Object.entries(project).forEach(data => {
        if(data[0] === "dataset")
            return;

        formData.append(data[0], JSON.stringify(data[1]));
    });

    return formData
}

const NewProjectContextProvider = ({ children }: { children: ReactNode }) => {
    const [project, setProject] = useState<ProjectType>({
        projectName: "",
        adminName: "",
        adminMobile: "",
        recorder:[],
        reviewer: [],
        reviewPoints: 0,
        recordPoints: 0,
        dataset: null
    });

    const [loading, setLoading] = useState<NewProjectContextType["loading"]>({
        create: false,
    })

    const recorederCountRef = useRef(1);
    const reviewerCountRef = useRef(1);

    const addUser: NewProjectContextType["addUser"] = (type, mobile) => {
        const user = [...project[type]];
        const newUser: ProjectUserType = {
            name: `${type === "recorder" ? "Recorder" : "Reviewer"} ${type === "recorder" ? recorederCountRef.current++ : reviewerCountRef.current++}`,
            mobile 
        }
        user.push(newUser);
        setProject(prev => ({...prev, [type]: user}));
    }

    const deleteUser: NewProjectContextType["deleteUser"] = (type, name) => {
        const user = project[type].filter(user => user.name !== name);
        setProject(prev => ({...prev, [type]: user}));
    }

    const createProject: NewProjectContextType["createProject"] = async () => {
        setLoading(prev => ({...prev, create: true}));
        const formData = createFormData(project);
        const headers: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        };

        const res = await axiosRequest.post(ENDPOINT.project.new, formData, headers);
        setLoading(prev => ({...prev, create: false}));

        if(res?.status !== 200)
            return false;

        return true;
    }
 
    return (
        <newProjectContext.Provider value={{
            project,
            loading,
            setProject,
            addUser,
            deleteUser,
            createProject
        }} >
            {children}
        </newProjectContext.Provider>
    );
}

export default NewProjectContextProvider;
