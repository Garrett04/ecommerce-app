import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../apis/client";

const Logout = () => {
    const navigate = useNavigate();

    const handleClick = () => {
      localStorage.removeItem('token');
      setAuthToken(); // Removes the authorization header
      navigate('/');
    }; 

    return (
      <button onClick={handleClick}>Logout</button>
    )
}

export default Logout;