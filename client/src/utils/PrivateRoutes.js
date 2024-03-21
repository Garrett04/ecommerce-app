import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getIsAuthenticatedStatus, selectIsAuthenticated } from "../features/auth/authSlice";
import GoBackButton from "../components/GoBackButton";

const PrivateRoutes = () => {
    const location = useLocation();
    const isAuthenticatedStatus = useSelector(getIsAuthenticatedStatus);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    if (isAuthenticatedStatus === 'fulfilled') {
        if (isAuthenticated) {
            return (
                <>
                    <Outlet/>
                    <GoBackButton/>
                </>
            ); // Proceeding to the protected route
        } else {
            // console.log(isAuthenticatedStatus, location);
            return <Navigate to="/login" replace state={{ from: location }}/>;
        }
    }
};

export default PrivateRoutes;