import { useUserContext } from "@/context/userContext"
import { Link } from "react-router-dom";

const Header = () => {
  const { isUserLogged} = useUserContext();

  if(!isUserLogged)
    return <></>

  return (
    <>
      <div className='p-2 h-[60px] flex items-center justify-between'>
        <Link to="/">
          <h1>Voicecord</h1>
        </Link>
      </div>
    </>
  )
}

export default Header
