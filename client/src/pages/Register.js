import { useCallback, useState } from "react"
import { Link } from "react-router-dom";


const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleChange = useCallback((e) => e.target.name === 'username' ? setUsername(e.target.value) : setPassword(e.target.value), []);

    return (
      <div className="register">
        <h1>Register Account</h1>
        <form action="/api/register" method="POST">
          <div>
            <label htmlFor="username">Username:</label>
            <input 
              type="text" 
              name="username" 
              id="username" 
              value={username} 
              onChange={handleChange} 
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
            />
          </div>
          <input type="submit" value="Register" />
        </form>
        <p>Already Registered? <Link to="/login">Login here</Link></p>
      </div>
    )
}
export default Register