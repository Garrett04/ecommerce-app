import { useDispatch, useSelector } from "react-redux"
import { getUserError, getUserStatus } from "../../features/user/userSlice";
import { useEffect, useState } from "react";
import { fetchUserData } from "../../apis/user";
import Addresses from "../../components/main/user/addresses/Addresses";
import { DNA } from "react-loader-spinner";
import UserForm from "../../components/main/user/UserForm";

const User = () => {
    const userStatus = useSelector(getUserStatus);
    const userError = useSelector(getUserError);

    const [msg, setMsg] = useState("");

    // used in the readOnly attribute in input field elements
    const [readOnly, setReadOnly] = useState(true);
    // used to toggle between buttons
    const [toggleVisibility, setToggleVisibility] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(fetchUserData());
    }, [dispatch])

    const renderUserData = () => {
      return (
        <UserForm
          readOnly={readOnly}
          toggleVisibility={toggleVisibility}
          setReadOnly={setReadOnly}
          setToggleVisibility={setToggleVisibility} 
          setMsg={setMsg}
        />
      )
    }

    const handleClick = () => {
      setToggleVisibility(true);
      setReadOnly(false);
    }

    let userContent;
    if (userStatus === 'pending') {
      userContent = <DNA wrapperStyle={{ display: 'flex', margin: 'auto' }} />
    } else if (userStatus === 'fulfilled') {
      userContent = renderUserData();
    } else if (userStatus === 'rejected') {
      userContent = userError;
    }

    return (
      <div className="user">
        <div className="userInfo">
          <h2>User Information</h2>
          {msg}
          {userContent}
          <button onClick={handleClick} hidden={toggleVisibility}>Change Personal Details</button>
        </div>
        <hr/>
        <Addresses />
      </div>
    )
}

export default User;