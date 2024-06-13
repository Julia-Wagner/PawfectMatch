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
                    toast.error(err.response?.data);
                }
            }
        };

        handleMount();
    }, [navigate, userAuthStatus]);
}