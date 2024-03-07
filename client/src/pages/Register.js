import { useCallback, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { register } from "../apis/auth";


const Register = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [errMsg, setErrMsg] = useState();
    const navigate = useNavigate();

    const handleChange = useCallback((e) => e.target.name === 'username' ? setUsername(e.target.value) : setPassword(e.target.value), []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        console.log(username, password);
        const userData = await register({username, password});
        console.log(userData.token);

        localStorage.setItem('token', userData.token);

        navigate('/login');
        
      } catch (err) {
        if (err.status === 409) {
          // console.log('check1', err)
          setErrMsg(err.data.msg);
        } else {
          console.error('Registration failed:', err.message);
        }
      }
    }

    return (
      <div className="register">
        <h1>Register Account</h1>
        <form action="/api/users/register" method="POST" onSubmit={handleSubmit}>
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
          <input type="submit" value="Register" />
        </form>
        {errMsg}
        <p>Already Registered? <Link to="/login">Login here</Link></p>
      </div>
    )
}
export default Register