import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, setAuthToken } from "../apis/client";
import { useSelector } from "react-redux";
import { getIsAuthenticatedStatus, selectIsAuthenticated } from "../features/auth/authSlice";

const PrivateRoutes = () => {
    const location = useLocation();
    const isAuthenticatedStatus = useSelector(getIsAuthenticatedStatus);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    if (isAuthenticatedStatus === 'fulfilled') {
        console.log('hello');
    }

    if (isAuthenticatedStatus === 'fulfilled') {
        if (isAuthenticated) {
            // setAuthToken(); // Sets auth token to the header indicating its present in localStorage
            return <Outlet/>; // Proceeding to the protected route
        } else {
            console.log(isAuthenticatedStatus, location);
            return <Navigate to="/login" replace state={{ from: location }}/>;
        }
    }
};

export default PrivateRoutes;