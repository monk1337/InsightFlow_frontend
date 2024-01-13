import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme } from "./theme/theme";
import Layout from "@/layout/Layout";
import Home from "@/pages/home/Home";
import NewProject from "@/pages/new/NewProject";
import { Login } from "@/pages/login/Login";
import UserContextProvider from "@/context/userContext";
import NewProjectContextProvider from "./pages/new/context/NewProjectContext";
import ToastProvider from "./context/ToastContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "new",
        element: <NewProjectContextProvider>
          <NewProject />
        </NewProjectContextProvider>
      },
      {
        path: "login",
        element: <Login />
      },
    ]
  },
]);

function App() {

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ToastProvider>
          <UserContextProvider>
            <RouterProvider router={router} />
          </UserContextProvider>
        </ToastProvider>

      </ThemeProvider>
    </>
  )
}

export default App
