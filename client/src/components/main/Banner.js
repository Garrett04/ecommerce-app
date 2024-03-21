import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../features/auth/authSlice';

const Banner = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const renderAccountComponent = () => {
    if (!isAuthenticated) {
      return (
        <div className="account">
            <NavLink to="/register" className="register-btn">
                Register Account
            </NavLink>
            <NavLink to="/login" className="login-btn">
                Login
            </NavLink>
        </div>
      )
    }
  }

  return (
    <div className="banner">
        <div className="promo"></div>
        {renderAccountComponent()}
    </div>
  )
}

export default Banner;