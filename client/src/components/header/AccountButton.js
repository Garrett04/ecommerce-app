import { NavLink } from "react-router-dom";
import accountIcon from "../../resources/images/account.svg";

const SignInButton = () => {
  return (
    <div className="signIn">
        <NavLink to="/user" title="Sign in" className="accountBtn">
            <img src={accountIcon} alt="Sign In Icon" />
        </NavLink>
    </div>
  )
}
export default SignInButton;