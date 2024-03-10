import { useDispatch, useSelector } from "react-redux"
import { getUserError, getUserStatus, selectUser } from "../features/user/userSlice";
import { useEffect, useState } from "react";
import { fetchUserData, updateUser } from "../apis/user";


const User = () => {
    const user = useSelector(selectUser);
    const userStatus = useSelector(getUserStatus);
    const userError = useSelector(getUserError);
    const [msg, setMsg] = useState("");

    // All form fields
    const [username, setUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // used in the readOnly attribute in input field elements
    const [readOnly, setReadOnly] = useState(true);
    // used to toggle between buttons
    const [toggleVisibility, setToggleVisibility] = useState(false);

    const dispatch = useDispatch();

    const handleChange = (e) => {
      if (e.target.name === 'username') {
        setUsername(e.target.value);
      } else if (e.target.name === 'oldPassword') {
        setOldPassword(e.target.value);
      } else if (e.target.name === 'newPassword') {
        setNewPassword(e.target.value);
      } else if (e.target.name === 'firstName') {
        setFirstName(e.target.value);
      } else {
        setLastName(e.target.value);
      }
    }

    useEffect(() => {
      dispatch(fetchUserData());
    }, [dispatch])

    // Update user fields to the current data
    useEffect(() => {
      if (userStatus === 'fulfilled') {
        setUsername(user.username);
        setFirstName(user.first_name);
        setLastName(user.last_name);
      }
    }, [userStatus])

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const updatedUser = await updateUser({
          username,
          oldPassword,
          newPassword,
          first_name: firstName,
          last_name: lastName
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

    const renderUserData = () => {
      return (
        <form action="/api/users" method="PUT" onSubmit={handleSubmit}>
          <label htmlFor="username">Username: </label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={username} 
            onChange={handleChange}
            readOnly={readOnly}
          />
          <label htmlFor="firstName">First name: </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={handleChange}
            readOnly={readOnly}
          />
          <label htmlFor="lastName">Last name: </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={handleChange}
            readOnly={readOnly}
          />
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
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
            readOnly={readOnly}
            required
          />
          <input type="submit" value="Update Personal Details" hidden={!toggleVisibility}/>
        </form>
      )
    }

    const handleClick = () => {
      setToggleVisibility(true);
      setReadOnly(false);
    }

    let content;
    if (userStatus === 'pending') {
      content = 'Loading...'
    } else if (userStatus === 'fulfilled') {
      content = renderUserData();
    } else if (userStatus === 'rejected') {
      content = userError;
    }

    return (
      <div className="user">
        {content}
        {msg}
        <button onClick={handleClick} hidden={toggleVisibility}>Change Personal Details</button>
      </div>
    )
}
export default User