import React, { createContext, useContext, useState } from "react";


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

export const useSavedPosts = () => useContext(SavedPostsContext);