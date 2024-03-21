import { useEffect, useState } from "react";
import { getUserStatus, selectUser } from "../../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateUser } from "../../../apis/user";


const UserForm = ({
  readOnly,
  toggleVisibility,
  setReadOnly,
  setToggleVisibility,
  setMsg
}) => {
  const user = useSelector(selectUser);
  const userStatus = useSelector(getUserStatus);
  
  const dispatch = useDispatch();

  // All form fields
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleChange = (e) => {
    if (e.target.name === 'username') setUsername(e.target.value)
    else if (e.target.name === 'oldPassword') setOldPassword(e.target.value);
    else if (e.target.name === 'newPassword') setNewPassword(e.target.value);
    else if (e.target.name === 'firstName') setFirstName(e.target.value);
    else if (e.target.name === 'lastName') setLastName(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        username,
        oldPassword,
        newPassword,
        first_name: firstName,
        last_name: lastName,
        login_method: user.login_method
      })

      // Once updated successfully display a message and set the state back to initial
      setMsg("Updated user details successfully");
      
      dispatch(fetchUserData()); // Update the state after updating user details

      setReadOnly(true);
      setToggleVisibility(false);

    } catch (err) {
      if (err.status === 400 || err.status === 401) {
        setMsg(err.data.msg)
      }
    }

    // Update password input fields back to empty
    setOldPassword("");
    setNewPassword("");
  }

  // Update user fields to the current data
  useEffect(() => {
    if (userStatus === 'fulfilled') {
      setUsername(user.username || ""); // If user data is undefined then empty string
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
    }
  }, [userStatus, user.first_name, user.username, user.last_name])

  // if user.login_method is google then return a form to only update username, first name and last name.
  if (user.login_method === 'google') {
      return (
        <form onSubmit={handleSubmit} className="userUpdateForm">
          <div>
            <label htmlFor="username">Username: </label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={username} 
              onChange={handleChange}
              readOnly={readOnly}
            />
          </div>
          <div>
            <label htmlFor="firstName">First name: </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              readOnly={readOnly}
              maxLength="50"
            />
          </div>
          <div>
            <label htmlFor="lastName">Last name: </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              readOnly={readOnly}
              maxLength="50"
            />
          </div>
          <input type="submit" value="Update Personal Details" hidden={!toggleVisibility}/>
        </form>
    )
  } else if (user.login_method === 'custom') {
    return (
      <form onSubmit={handleSubmit} className="userUpdateForm">
          <div>
            <label htmlFor="username">Username: </label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={username} 
              onChange={handleChange}
              readOnly={readOnly}
            />
          </div>
          <div>
            <label htmlFor="firstName">First name: </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              readOnly={readOnly}
              maxLength="50"
            />
          </div>
          <div>
            <label htmlFor="lastName">Last name: </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              readOnly={readOnly}
              maxLength="50"
            />
          </div>
          <div>
            <label htmlFor="oldPassword">Old Password: </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={oldPassword}
              onChange={handleChange}
              readOnly={readOnly}
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword">New Password: </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handleChange}
              readOnly={readOnly}
              required
            />
          </div>
          <input type="submit" value="Update Personal Details" hidden={!toggleVisibility}/>
      </form>
    )
  }
}

export default UserForm;