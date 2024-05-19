import React, {useEffect, useState} from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import {Link, useLocation} from "react-router-dom";
import {axiosReq} from "../../api/axiosDefaults";
import Post from "./Post";
import {Image} from "react-bootstrap";
import { useCurrentUser, useIsShelterUser } from "../../contexts/CurrentUserContext";

import NoResults from "../../assets/playground.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import {fetchMoreData} from "../../utils/utils";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import Sidebar from "../../components/Sidebar";
import {useFollowers} from "../../contexts/FollowersContext";

function PostsPage({message, filter = ""}) {
    const [posts, setPosts] = useState({results: []});
    const [hasLoaded, setHasLoaded] = useState(false);
    const {pathname} = useLocation();

    const currentUser = useCurrentUser();
    const isShelterUser = useIsShelterUser();
    const {shouldUpdate} = useFollowers();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const {data} = await axiosReq.get(`/posts/?${filter}`)
                setPosts(data)
                setHasLoaded(true)
            } catch (err) {
                console.log(err)
            }
        }

        setHasLoaded(false);
        fetchPosts();
    }, [filter, pathname, currentUser, shouldUpdate, isShelterUser]);

    return (
        <Container>
            <Row className="h-100 mt-4">
                <Col className="py-2 p-0 p-lg-2" lg={8}>
                    {isShelterUser ? (
                        <Row className="d-flex justify-content-end m-auto">
                            <Link to="/posts/create" className={`w-auto mb-4 ${btnStyles.Button}`}><i className="fa fa-plus"></i> Create Post</Link>
                        </Row>
                    ) : (
                        <div className="text-end mb-4"><i className="fa fa-exclamation-circle"></i> Sign in as a shelter to create posts</div>
                    )}
                    {hasLoaded ? (
                        <>
                            {posts.results.length ? (
                                <InfiniteScroll
                                    children={
                                    posts.results.map((post) => (
                                        <Post key={post.id} {...post} setPosts={setPosts} />
                                    ))}
                                    next={() => fetchMoreData(posts, setPosts)}
                                    hasMore={!!posts.next}
                                    loader={<Asset spinner />}
                                    dataLength={posts.results.length}/>
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