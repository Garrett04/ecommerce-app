import { NavLink } from 'react-router-dom';
import bannerPromo from '../../resources/images/banner-promo.jpg'
import { isAuthenticated, setAuthToken } from '../../apis/client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserStatus, selectUser } from '../../features/user/userSlice';

const Banner = () => {
  const user = useSelector(selectUser);
  const userStatus = useSelector(getUserStatus);

  useEffect(() => {
    if (userStatus === 'fulfilled') {
      // console.log(user.token);
      localStorage.setItem('token', user.token);
      setAuthToken();
      // console.log(isAuthenticated());
    }
  }, [userStatus, user.token])

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
        {!isAuthenticated(userStatus) ? renderAccountComponent() : null}
    </div>
  )
}

export default Banner;