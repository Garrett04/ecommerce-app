import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, setAuthToken } from "../apis/client";

const PrivateRoutes = () => {
    const location = useLocation();

    if (isAuthenticated()) {
        setAuthToken(); // Sets auth token to the header indicating its present in localStorage
        return <Outlet/>; // Proceeding to the protected route
    } else {
        return <Navigate to="/login" replace state={{ from: location }}/>;
    }
};

export default PrivateRoutes;