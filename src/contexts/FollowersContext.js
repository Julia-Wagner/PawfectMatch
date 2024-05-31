import React, { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types';


const FollowersContext = createContext();

export const FollowersProvider = ({ children }) => {
    const [shouldUpdate, setShouldUpdate] = useState(false);

    const triggerUpdate = () => {
        setShouldUpdate(!shouldUpdate);
    };

    return (
        <FollowersContext.Provider value={{ shouldUpdate, triggerUpdate }}>
            {children}
        </FollowersContext.Provider>
    );
};

FollowersProvider.propTypes = {
    children: PropTypes.node,
};

export const useFollowers = () => useContext(FollowersContext);