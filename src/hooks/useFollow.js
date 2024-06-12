import {axiosReq, axiosRes} from "../api/axiosDefaults";
import {useFollowers} from "../contexts/FollowersContext";
import {toast} from "react-toastify";

const useFollow = () => {
    const {triggerUpdate} = useFollowers();

    const handleFollow = async (clickedId) => {
        try {
            await axiosReq.post("/followers/", {followed: clickedId});
            triggerUpdate();
            toast.success("Followed successfully");
        } catch (err) {
            toast.error(err.response?.data);
        }
    };

    const handleUnfollow = async (clickedId) => {
        try {
            const clickedProfile = await axiosReq.get(`/profiles/${clickedId}/`);
            await axiosRes.delete(`/followers/${clickedProfile.data.following_id}/`);
            triggerUpdate();
            toast.success("Unfollowed successfully");
        } catch (err) {
            toast.error(err.response?.data);
        }
    };

    return {handleFollow, handleUnfollow};
};

export default useFollow;
