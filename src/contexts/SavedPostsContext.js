import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';

const SavedPostsContext = createContext();

export const SavedPostsProvider = ({ children }) => {
    const [shouldUpdate, setShouldUpdate] = useState(false);

    const triggerUpdate = useCallback(() => {
        setShouldUpdate(prevState => !prevState);
    }, []);

    const contextValue = useMemo(() => ({ shouldUpdate, triggerUpdate }), [shouldUpdate, triggerUpdate]);

    return (
        <SavedPostsContext.Provider value={contextValue}>
            {children}
        </SavedPostsContext.Provider>
    );
};

SavedPostsProvider.propTypes = {
    children: PropTypes.node,
};

export const useSavedPosts = () => useContext(SavedPostsContext);