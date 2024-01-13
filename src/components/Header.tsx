import { useUserContext } from "@/context/userContext"
import { Logout } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  const { isUserLogged, logout } = useUserContext();

  if(!isUserLogged)
    return <></>

  return (
    <>
      <div className='p-2 h-[60px] flex items-center justify-between'>
        <Link to="/">
          <h1>Voicecord</h1>
        </Link>
        <IconButton onClick={logout}>
          <Logout />
        </IconButton>
      </div>
    </>
  )
}

export default Header
