import { isAuthenticated, removeAuthToken } from "../../apis/client";
import { logout } from "../../apis/auth";
import { useSelector } from "react-redux";
import { getUserStatus } from "../../features/user/userSlice";

const Logout = () => {
    const userStatus = useSelector(getUserStatus);

    const handleClick = () => {
      localStorage.removeItem('token');
      removeAuthToken(); // Removes the authorization header
      logout();
    }; 

    return (
      <>
        {isAuthenticated(userStatus) ? <a className="logOutBtn" href="/" onClick={handleClick}>Logout</a> : null}
      </>
    )
}

export default Logout;