import React from "react";
import PropTypes from 'prop-types';
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

PrivateRoute.propTypes = {
    children: PropTypes.node,
};

export default PrivateRoute;