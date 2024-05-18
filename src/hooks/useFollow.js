import { useState } from "react";
import { axiosReq } from "../api/axiosDefaults";

const useFollow = (profileId, oldFollowingId = null) => {
    const [followingId, setFollowingId] = useState(oldFollowingId);

    const handleFollow = async () => {
        try {
            const {data} = await axiosReq.post("/followers/", {followed: profileId});
            setFollowingId(data.id);
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnfollow = async () => {
        try {
            await axiosReq.delete(`/followers/${followingId}/`);
            setFollowingId(null);
        } catch (err) {
            console.log(err);
        }
    };

    return {followingId, handleFollow, handleUnfollow};
};

export default useFollow;
