import React from "react";
import {Navigate} from "react-router-dom";
import {useCurrentUser} from "../contexts/CurrentUserContext";
import Asset from "./Asset";

function PrivateRoute({ children }) {
    const currentUser = useCurrentUser();

    if (currentUser === undefined) {
        return <Asset spinner /> ;
    }

    return currentUser ? children : <Navigate to="/signin" replace />;
}

export default PrivateRoute;