import React, { createContext, useContext, useState } from "react";


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

export const useFollowers = () => useContext(FollowersContext);