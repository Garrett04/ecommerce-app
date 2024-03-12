import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../apis/client";
import { logout } from "../../apis/auth";

const Logout = () => {
    const handleClick = () => {
      localStorage.removeItem('token');
      setAuthToken(); // Removes the authorization header
      logout();
    }; 

    return (
      <a className="logOutBtn" href="/" onClick={handleClick}>Logout</a>
    )
}

export default Logout;