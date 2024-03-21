import { fetchAuthenticationStatus } from "../../apis/client";
import { logout } from "../../apis/auth";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../features/auth/authSlice";
import { NavLink } from "react-router-dom";

import logoutIcon from '../../resources/images/logout.svg'

const LogoutButton = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();

    const handleClick = async () => {
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

export default LogoutButton;