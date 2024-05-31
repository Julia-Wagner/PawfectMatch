import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import Spinner from "react-bootstrap/Spinner";
import styles from "../styles/Asset.module.css";

const Asset = ({ spinner, src, message }) => {
    return (
        <div className={`${styles.Asset} p-4`}>
            {spinner && <div className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>}
            {src && <img src={src} alt={message} />}
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
};

Asset.propTypes = {
    spinner: PropTypes.bool,
    src: PropTypes.string,
    message: PropTypes.string,
};

export default Asset;