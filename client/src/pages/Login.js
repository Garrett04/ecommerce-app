import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { login } from "../apis/auth";


const Login = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [errMsg, setErrMsg] = useState();
    const navigate = useNavigate();

    const handleChange = useCallback((e) => e.target.name === 'username' ? setUsername(e.target.value) : setPassword(e.target.value));

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const user = await login({ username, password });

        // console.log(user.token);

        localStorage.setItem('token', user.token);

        navigate('/');

      } catch (err) {
        // console.log(err);
        if (err.status === 404) {
          setErrMsg(err.data.msg);
        }
      }
    }

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
        </div>
    )
}

export default Login;