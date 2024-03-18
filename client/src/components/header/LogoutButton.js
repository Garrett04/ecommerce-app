import { fetchAuthenticationStatus, isAuthenticated, removeAuthToken } from "../../apis/client";
import { logout } from "../../apis/auth";
import { useDispatch, useSelector } from "react-redux";
import { getUserStatus } from "../../features/user/userSlice";
import { selectIsAuthenticated } from "../../features/auth/authSlice";
import { NavLink } from "react-router-dom";

const Logout = () => {
    const userStatus = useSelector(getUserStatus);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();

    const handleClick = async () => {
      // localStorage.removeItem('token');
      // removeAuthToken(); // Removes the authorization header
      await logout();
      await dispatch(fetchAuthenticationStatus());
    };

    return (
      <>
        {isAuthenticated ? <NavLink className="logOutBtn" to="/" onClick={handleClick}>Logout</NavLink> : null}
      </>
    )
}

export default Logout;