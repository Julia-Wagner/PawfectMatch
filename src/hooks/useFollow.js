import {axiosReq, axiosRes} from "../api/axiosDefaults";
import {useFollowers} from "../contexts/FollowersContext";

const useFollow = (clickedId = null) => {
    const {triggerUpdate} = useFollowers();

    const handleFollow = async (clickedId) => {
        try {
            await axiosReq.post("/followers/", {followed: clickedId});
            triggerUpdate();
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnfollow = async (clickedId) => {
        try {
            const clickedProfile = await axiosReq.get(`/profiles/${clickedId}/`);
            await axiosRes.delete(`/followers/${clickedProfile.data.following_id}/`);
            triggerUpdate();
        } catch (err) {
            console.log(err);
        }
    };

    return {handleFollow, handleUnfollow};
};

export default useFollow;
