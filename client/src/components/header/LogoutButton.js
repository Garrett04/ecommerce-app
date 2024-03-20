import { fetchAuthenticationStatus, isAuthenticated, removeAuthToken } from "../../apis/client";
import { logout } from "../../apis/auth";
import { useDispatch, useSelector } from "react-redux";
import { getUserStatus } from "../../features/user/userSlice";
import { selectIsAuthenticated } from "../../features/auth/authSlice";
import { NavLink } from "react-router-dom";

import logoutIcon from '../../resources/images/logout.svg'

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
        {isAuthenticated 
        && 
        <div className="logout">
          <NavLink className="logOutBtn" title="Logout" to="/" onClick={handleClick}>
            <img src={logoutIcon} alt="logout icon" />
          </NavLink>
        </div>}
      </>
    )
}

export default Logout;