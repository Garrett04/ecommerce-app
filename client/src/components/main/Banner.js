import { Link, NavLink } from 'react-router-dom';
import bannerPromo from '../../resources/images/banner-promo.jpg'

const Banner = () => {
  return (
    <div className="banner">
        <img src={bannerPromo} alt="banner promo" />
        <div className="account">
            <NavLink to="/register" className="register-btn">
                Register Account
            </NavLink>
            <NavLink to="/login" className="login-btn">
                Login
            </NavLink>
        </div>
    </div>
  )
}

export default Banner;