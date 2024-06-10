import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';

const FollowersContext = createContext();

export const FollowersProvider = ({ children }) => {
    const [shouldUpdate, setShouldUpdate] = useState(false);

    const triggerUpdate = useCallback(() => {
        setShouldUpdate(prevState => !prevState);
    }, []);

    const contextValue = useMemo(() => ({ shouldUpdate, triggerUpdate }), [shouldUpdate, triggerUpdate]);

    return (
        <FollowersContext.Provider value={contextValue}>
            {children}
        </FollowersContext.Provider>
    );
};

FollowersProvider.propTypes = {
    children: PropTypes.node,
};

export const useFollowers = () => useContext(FollowersContext);