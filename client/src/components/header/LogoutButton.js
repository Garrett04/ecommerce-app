import { isAuthenticated, removeAuthToken } from "../../apis/client";
import { logout } from "../../apis/auth";
import { useSelector } from "react-redux";
import { getUserStatus } from "../../features/user/userSlice";
import { selectIsAuthenticated } from "../../features/auth/authSlice";

const Logout = () => {
    const userStatus = useSelector(getUserStatus);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const handleClick = () => {
      // localStorage.removeItem('token');
      // removeAuthToken(); // Removes the authorization header
      logout();
    }; 

    return (
      <>
        {isAuthenticated ? <a className="logOutBtn" href="/" onClick={handleClick}>Logout</a> : null}
      </>
    )
}

export default Logout;