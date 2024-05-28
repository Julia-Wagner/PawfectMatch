import React from "react";
import NoResults from "../assets/playground.svg";
import Asset from "./Asset";

const NotFound = () => {
    return (
        <div className="text-center mt-5">
            <h2>Whoops!</h2>
            <p>Page not found. You reached the dogs´ playground.</p>
            <Asset src={NoResults}/>
        </div>
    );
};

export default NotFound;