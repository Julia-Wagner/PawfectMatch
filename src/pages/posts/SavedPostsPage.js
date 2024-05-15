import React, {useEffect, useState} from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import {Link, useLocation} from "react-router-dom";
import {axiosReq} from "../../api/axiosDefaults";
import Post from "./Post";
import {Image} from "react-bootstrap";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import NoResults from "../../assets/playground.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import {fetchMoreData} from "../../utils/utils";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import Sidebar from "../../components/Sidebar";

function PostsPage({message = ""}) {
    const [posts, setPosts] = useState({results: []});
    const [hasLoaded, setHasLoaded] = useState(false);
    const {pathname} = useLocation();

    const currentUser = useCurrentUser();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const {data} = await axiosReq.get("/saves")
                const postIds = data.results.map((save) => save.post);
                const postItems = await Promise.all(postIds.map(async (postId) => {
                    const { data: post } = await axiosReq.get(`/posts/${postId}`);
                    return post;
                }));
                setPosts({ results: postItems })
                setHasLoaded(true)
            } catch (err) {
                console.log(err)
            }
        }

        setHasLoaded(false);
        fetchPosts();
    }, [pathname, currentUser]);

    return (
        <Container>
            <Row className="h-100 mt-4">
                <Col className="py-2 p-0 p-lg-2" lg={8}>
                    {hasLoaded ? (
                        <>
                            {posts.results.length ? (
                                <div>
                                    <h2 className="text-center mb-3">You have {posts.results.length} saved posts</h2>
                                    <InfiniteScroll
                                        children={
                                            posts.results.map((post) => (
                                                <Post key={post.id} {...post} setPosts={setPosts} />
                                            ))}
                                        next={() => fetchMoreData(posts, setPosts)}
                                        hasMore={!!posts.next}
                                        loader={<Asset spinner />}
                                        dataLength={posts.results.length}/>
                                </div>
                            ) : (
                                <Container className={appStyles.Content}>
                                    <h2 className="mt-3 mb-5 text-center">No posts to display.</h2>
                                    <Image src={NoResults} />
                                </Container>
                            )}
                        </>
                    ) : (
                        <Container className={`text-center ${appStyles.Content}`}>
                            <Asset spinner />
                        </Container>
                    )}
                </Col>
                <Sidebar/>
            </Row>
        </Container>
    );
}

export default PostsPage;