import { NavLink } from 'react-router-dom';
import bannerPromo from '../../resources/images/banner-promo.jpg'
import { isAuthenticated, setAuthToken } from '../../apis/client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserStatus, selectUser } from '../../features/user/userSlice';
import { selectIsAuthenticated } from '../../features/auth/authSlice';

const Banner = () => {
  const user = useSelector(selectUser);
  const userStatus = useSelector(getUserStatus);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // useEffect(() => {
  //   // Checks if it is a google user
  //   if (userStatus === 'fulfilled' && user.data?.login_method === 'google') {
  //     // console.log(user.token);
  //     localStorage.setItem('token', user.token);
  //     setAuthToken();
  //     // console.log(isAuthenticated());
  //   }
  // }, [userStatus, user.token])

  const renderAccountComponent = () => {
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

  return (
    <div className="banner">
        <div className="promo">
          <img src={bannerPromo} alt="banner promo" />
        </div>
        {/* If userStatus is not fulfilled and isAuthenticated is not true then renders AccountComponent */}
        {!isAuthenticated ? renderAccountComponent() : null}
    </div>
  )
}

export default Banner;