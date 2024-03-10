import { Link, redirect, useNavigate } from "react-router-dom";
import { setAuthToken } from "../../apis/client";

const Logout = () => {
    const navigate = useNavigate();

    const handleClick = () => {
      localStorage.removeItem('token');
      setAuthToken(); // Removes the authorization header
    }; 

    return (
      <a className="logOutBtn" href="/" onClick={handleClick}>Logout</a>
    )
}

export default Logout;