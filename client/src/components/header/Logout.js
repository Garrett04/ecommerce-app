import { useCallback } from "react";


const Logout = () => {
    const handleClick = useCallback(() => localStorage.removeItem('token'), []); 

    return (
      <button onClick={handleClick}>Logout</button>
    )
}

export default Logout;