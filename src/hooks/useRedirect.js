import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import {toast} from "react-toastify";

export const useRedirect = (userAuthStatus) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleMount = async () => {
            try {
                await axios.post("dj-rest-auth/token/refresh/")
                if (userAuthStatus === "loggedIn") {
                    toast.info("You are already logged in.");
                    navigate("/");
                }
            } catch (err) {
                if (userAuthStatus === "loggedOut") {
                    toast.info("You are logged out.");
                    navigate("/")
                } else {
                    let message = "Error, please try again later.";
                    if (err.response?.data?.detail) {
                        message = err.response?.data?.detail;
                    } else if (err.message) {
                        message = err.message;
                    }
                    toast.error(message);
                }
            }
        };

        handleMount();
    }, [navigate, userAuthStatus]);
}