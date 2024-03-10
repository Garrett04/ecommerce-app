import { NavLink } from 'react-router-dom';
import bannerPromo from '../../resources/images/banner-promo.jpg'
import { isAuthenticated } from '../../apis/client';

const Banner = () => {
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
        {!isAuthenticated() ? renderAccountComponent() : null}
    </div>
  )
}

export default Banner;