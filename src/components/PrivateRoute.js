import React from "react";
import {Navigate} from "react-router-dom";
import {useCurrentUser} from "../contexts/CurrentUserContext";

function PrivateRoute({ children }) {
    const currentUser = useCurrentUser();

    return currentUser ? children : <Navigate to="/signin" replace />;
}

export default PrivateRoute;