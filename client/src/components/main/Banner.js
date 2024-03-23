import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getIsAuthenticatedStatus, selectIsAuthenticated } from '../../features/auth/authSlice';
import { ColorRing } from 'react-loader-spinner';

const Banner = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthenticatedStatus = useSelector(getIsAuthenticatedStatus);

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

  if (isAuthenticatedStatus === 'pending') {
    return <ColorRing wrapperStyle={{ display: 'flex', margin: 'auto', width: '4rem' }} />;
  } else if (isAuthenticatedStatus === 'fulfilled') {
    return (
      <div className="banner">
          <div className="promo"></div>
          {renderAccountComponent()}
      </div>
    )
  }
}

export default Banner;