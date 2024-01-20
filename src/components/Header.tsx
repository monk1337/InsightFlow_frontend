import { useUserContext } from "@/context/userContext"
import { Logout } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const EXCEPTIONAL_PATHS = ["/new", "/login"]

const Header = () => {
  const { isUserLogged, logout } = useUserContext();

  const location = useLocation();

  if(!EXCEPTIONAL_PATHS.some(path => location.pathname === path) && !isUserLogged)
    return <></>

  return (
    <>
      <div className='p-2 h-[60px] flex items-center justify-between'>
        <Link to="/">
          <h1>InsightFlow</h1>
        </Link>
        {isUserLogged &&
        <IconButton onClick={logout}>
          <Logout />
        </IconButton>}
      </div>
    </>
  )
}

export default Header
