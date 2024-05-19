import {Container, Image} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import appStyles from "../App.module.css";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {useCurrentUser} from "../contexts/CurrentUserContext";
import {axiosReq} from "../api/axiosDefaults";
import Asset from "./Asset";
import {useSavedPosts} from "../contexts/SavedPostsContext";

const Sidebar = () => {
    const [posts, setPosts] = useState({results: []});
    const [hasLoaded, setHasLoaded] = useState(false);
    const {pathname} = useLocation();

    const currentUser = useCurrentUser();
    const {shouldUpdate} = useSavedPosts();

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const {data} = await axiosReq.get("/saves");
                const postIds = data.results.map((save) => save.post).slice(0, 5);
                const postItems = await Promise.all(postIds.map(async (postId) => {
                    const { data: post } = await axiosReq.get(`/posts/${postId}`);
                    return post;
                }));
                setPosts(postItems)
                setHasLoaded(true)
            } catch (err) {
                console.log(err)
            }
        }

        setHasLoaded(false);
        fetchSavedPosts();
    }, [pathname, currentUser, shouldUpdate]);

    return (
        <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
            <Container className={`p-4 ${appStyles.Content}`}>
                <h3 className={`text-center ${appStyles.SidebarHeading}`}>Saved Posts</h3>
                {currentUser ? (
                    <>
                        {hasLoaded ? (
                            <>
                                <div className="mt-4 text-left">
                                    {posts.length ? (
                                        posts.map((post) => (
                                            <p key={post.id}>
                                                <Link to={`/posts/${post.id}`} className={appStyles.SidebarLink}>{post.title} </Link>
                                                by {post.owner}</p>
                                        ))
                                    ) : (
                                        <p>You have no saved posts yet.</p>
                                    )}
                                    <div className="mt-4 text-center">
                                        <Link to={"/saves"}>Show all saved posts</Link>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Asset spinner />
                        )}
                    </>
                ) : (
                    <p>Please sign in to see your saved posts.</p>
                )}
            </Container>
        </Col>
    );
}

export default Sidebar;