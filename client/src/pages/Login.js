import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { login } from "../apis/auth";
import { fetchAuthenticationStatus } from "../apis/client";
import { useDispatch, useSelector } from "react-redux";
import GoogleButton from "react-google-button";
import { getIsAuthenticatedStatus, selectIsAuthenticated } from "../features/auth/authSlice";


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isAuthenticatedStatus = useSelector(getIsAuthenticatedStatus);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleChange = useCallback((e) => e.target.name === 'username' ? setUsername(e.target.value) : setPassword(e.target.value), []);

    const handleClick = async () => {
      // Redirects user to Google login page
      window.open(`${process.env.REACT_APP_API_URL}/api/auth/google`, "_self")
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await login({ username, password });

        dispatch(fetchAuthenticationStatus());

        // Checks if the user got redirected to the login page from a protected route
        // If so then navigate that user back to the same protected route after a successful login
        // Else back to homepage if user went straight to login route.
        if (location.state?.from) {
          navigate(location.state.from);
        } else {
          navigate('/');
        }
      } catch (err) {
        // console.log(err);
        if (err.status === 404 || err.status === 401) {
          setErrMsg(err.data.msg);
        }
      }
    }

    useEffect(() => {
      // Redirects authenticated user back to homescreen
      if (isAuthenticatedStatus === 'fulfilled' && isAuthenticated) {
        navigate('/');
      }
    }, [isAuthenticatedStatus, isAuthenticated, navigate])

    return (
      <div className="login">
          <h1>Login Account</h1>
          <form action="/api/users/login" method="POST" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input 
                type="text" 
                name="username" 
                id="username" 
                value={username} 
                onChange={handleChange} 
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>{" "}
              <input 
                type="password" 
                name="password"
                id="password" 
                value={password} 
                onChange={handleChange}
                required 
              />
            </div>
            <input type="submit" value="Login" />
          </form>
          {errMsg}
          <p>Do not have a ShopWise Account? <Link to="/register">Register here</Link></p>
          <p>Other login methods</p>
          <GoogleButton className="googleButton" onClick={handleClick}/>
        </div>
    )
}

export default Login;