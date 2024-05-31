import React, { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types';


const SavedPostsContext = createContext();

export const SavedPostsProvider = ({ children }) => {
    const [shouldUpdate, setShouldUpdate] = useState(false);

    const triggerUpdate = () => {
        setShouldUpdate(!shouldUpdate);
    };

    return (
        <SavedPostsContext.Provider value={{ shouldUpdate, triggerUpdate }}>
            {children}
        </SavedPostsContext.Provider>
    );
};

SavedPostsProvider.propTypes = {
    children: PropTypes.node,
};

export const useSavedPosts = () => useContext(SavedPostsContext);