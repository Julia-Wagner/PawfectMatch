import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import {useCurrentUser} from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {Button, Image} from "react-bootstrap";
import {Link} from "react-router-dom";
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import {fetchMoreData} from "../../utils/utils";
import Sidebar from "../../components/Sidebar";
import useFollow from "../../hooks/useFollow";
import {useFollowers} from "../../contexts/FollowersContext";

function ProfilePage() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const currentUser = useCurrentUser();
    const {shouldUpdate} = useFollowers();

    const {id} = useParams();
    const [profile, setProfileData] = useState({});
    const is_owner = currentUser?.username === profile?.owner;
    const {handleFollow, handleUnfollow} = useFollow(id);

    const [profilePosts, setProfilePosts] = useState({ results: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [{ data: pageProfile }, { data: profilePosts }] = await Promise.all([
                    axiosReq.get(`/profiles/${id}/`),
                    axiosReq.get(`/posts/?owner__profile=${id}`),
                ]);
                setProfileData(pageProfile);
                setProfilePosts(profilePosts);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id, setProfileData, shouldUpdate]);

    const mainProfile = (
        <Container>
            <Row className="px-3 text-center">
                <Col lg={3} className="text-lg-left">
                    <Image className={styles.ProfileImage} roundedCircle src={profile?.image} alt={profile.owner} />
                </Col>
                <Col lg={6}>
                    <h2 className="m-2">{profile?.name? profile.name : profile.owner}</h2>
                    <Row className="justify-content-center no-gutters">
                        <Col className="my-2">
                            <div>{profile?.posts_count}</div>
                            <div>posts</div>
                        </Col>
                        {profile && profile.type === "shelter" && (
                            <Col className="my-2">
                                <div>{profile?.dogs_count}</div>
                                <div>dogs</div>
                            </Col>
                        )}
                    </Row>
                </Col>
                <Col lg={3} className="text-lg-right">
                    {currentUser && !is_owner &&
                        (profile?.following_id ? (
                            <Button className={`m-2 ${btnStyles.Button}`} onClick={() => handleUnfollow(profile?.id)}>unfollow</Button>
                        ) : (
                            <Button className={`m-2 ${btnStyles.Button}`} onClick={() => handleFollow(profile?.id)}>follow</Button>
                        ))}
                    {is_owner && (
                        <Link to={`/profiles/${id}/edit`} className={`m-2 ${btnStyles.Button}`}>edit</Link>
                    )}
                </Col>
                {profile?.content && <Col className="p-3">{profile.content}</Col>}
            </Row>
        </Container>
    );

    const mainProfilePosts = (
        <Container>
            {profilePosts.results && profilePosts.results.length > 0 && (
                <>
                    <hr />
                    <p className="text-center">{profile?.name? profile.name : profile.owner}'s posts</p>
                    <hr />
                    <InfiniteScroll
                        children={profilePosts.results.map((post) => (
                            <Post key={post.id} {...post} setPosts={setProfilePosts} />
                        ))}
                        dataLength={profilePosts.results.length}
                        loader={<Asset spinner />}
                        hasMore={!!profilePosts.next}
                        next={() => fetchMoreData(profilePosts, setProfilePosts)}
                    />
                </>
            )}
        </Container>
    );

    return (
        <Container>
            <Row className="h-100 mt-4">
                <Col className="py-2 p-0 p-lg-2" lg={8}>
                    <Container className={appStyles.Content}>
                        {hasLoaded ? (
                            <>
                                {mainProfile}
                                {mainProfilePosts}
                            </>
                        ) : (
                            <Asset spinner />
                        )}
                    </Container>
                </Col>
                <Sidebar/>
            </Row>
        </Container>
    );
}

export default ProfilePage;