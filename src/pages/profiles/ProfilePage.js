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
import Sidebar from "../../components/Sidebar";
import useFollow from "../../hooks/useFollow";
import {useFollowers} from "../../contexts/FollowersContext";
import CommentCreateForm from "../comments/CommentCreateForm";
import Comment from "../comments/Comment";
import InfiniteScroll from "react-infinite-scroll-component";
import {fetchMoreData} from "../../utils/utils";

function ProfilePage() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const currentUser = useCurrentUser();
    const {shouldUpdate} = useFollowers();

    const {id} = useParams();
    const [profile, setProfileData] = useState({ results: [{}] });
    const is_owner = currentUser?.username === profile?.owner;
    const {handleFollow, handleUnfollow} = useFollow(id);

    const [comments, setComments] = useState({ results: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [{ data: pageProfile }, { data: comments }] = await Promise.all([
                    axiosReq.get(`/profiles/${id}/`),
                    axiosReq.get(`/comments/?profile=${id}`),
                ]);
                setProfileData(pageProfile);
                setComments(comments);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id, setProfileData, shouldUpdate]);

    const mainProfile = (
        <Container className="px-3">
            <Row className="mb-3">
                <Col lg={3} className="text-lg-left">
                    <Image className={styles.ProfileImage} roundedCircle src={profile?.image} alt={profile.owner} />
                </Col>
                <Col lg={6}>
                    <h2 className="m-2 text-center">{profile?.name? profile.name : profile.owner}</h2>
                    {profile && profile.type === "shelter" && (
                        <Row className="justify-content-center no-gutters text-center">
                            <Col className="my-2">
                                <div>{profile?.posts_count}</div>
                                <div>posts</div>
                            </Col>
                            <Col className="my-2">
                                <div>{profile?.dogs_count}</div>
                                <div>dogs</div>
                            </Col>
                        </Row>
                    )}
                </Col>
                <Col lg={3} className="text-lg-right">
                    {currentUser && !is_owner &&
                        (profile?.following_id ? (
                            <Button className={`m-2 ${btnStyles.Button}`} onClick={() => handleUnfollow(profile?.id)}>unfollow</Button>
                        ) : (
                            <Button className={`m-2 ${btnStyles.Button}`} onClick={() => handleFollow(profile?.id)}>follow</Button>
                        ))}
                    {is_owner && (
                        <Link to={`/profiles/${id}/edit`} className={`m-2 text-center ${btnStyles.Button}`}>edit</Link>
                    )}
                </Col>
            </Row>
            {profile?.description && (
                <Row className="p-3 text-center">{profile.description}</Row>
            )}
            {profile && profile.type === "shelter" && profile.posts_count > 0 && (
                <>
                    <hr />
                    <p className="text-center">
                        <Link to={`/posts/profile/${profile.id}`}>{profile?.name? profile.name : profile.owner}'s posts</Link>
                    </p>
                    <hr />
                </>
            )}
            <h3 className="mt-4 text-center">Contact details</h3>
            <Row className="mt-3">
                {profile?.phone_number && profile.type === "shelter" &&
                    <Col className="py-2 p-0 p-lg-2">
                        <i className={`fa-solid fa-phone ${appStyles.Icon} ${appStyles.BlueIcon}`}/> {profile.phone_number}
                    </Col>
                }
            </Row>
            <Row>
                {profile?.address &&
                    <Col className="py-2 p-0 p-lg-2">
                        <i className={`fa-solid fa-location-dot ${appStyles.Icon} ${appStyles.BlueIcon}`}/> {profile.address}
                    </Col>
                }
            </Row>
            <hr/>
        </Container>
    );

    const mainProfileComments = (
        <Container>
            <h3 className="mt-4 text-center">Comments</h3>
            {currentUser ? (
                <CommentCreateForm
                    commenter_id={currentUser?.profile_id}
                    commenter_image={currentUser?.profile_image}
                    profile={id}
                    setProfile={setProfileData}
                    setComments={setComments}
                />
            ) : comments.results.length ? (
                "Comments"
            ) : null}
            {comments.results.length ? (
                    <InfiniteScroll
                        children={comments.results.map((comment) => (
                            <Comment
                                key={comment.id}
                                {...comment}
                                setProfile={setProfileData}
                                setComments={setComments}
                            />
                        ))}
                        dataLength={comments.results.length}
                        loader={<Asset spinner />}
                        hasMore={!!comments.next}
                        next={() => fetchMoreData(comments, setComments)}
                    />
            ) : currentUser ? (
                <span>No comments yet, be the first to comment!</span>
            ) : (
                <span>No comments yet</span>
            )}
        </Container>
    );

    return (
        <Container>
            <Row className="h-100 mt-4">
                <Col className="py-2 p-0 p-lg-2" lg={8}>
                    <Container className={`py-4 ${appStyles.Content}`}>
                        {hasLoaded ? (
                            <>
                                {mainProfile}
                                {mainProfileComments}
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