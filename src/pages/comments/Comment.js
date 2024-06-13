import React, { useState } from "react";
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {MoreDropdown} from "../../components/MoreDropdown";
import CommentEditForm from "./CommentEditForm";

import styles from "../../styles/ProfilePage.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import {toast} from "react-toastify";

const Comment = (props) => {
    const {
        profile_id,
        profile_image,
        owner,
        updated_at,
        content,
        id,
        setProfile,
        setComments,
    } = props;

    const [showEditForm, setShowEditForm] = useState(false);
    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/comments/${id}/`);
            setProfile((prevProfile) => {
                if (prevProfile.results && prevProfile.results.length > 0) {
                    return {
                        results: [
                            {
                                ...prevProfile.results[0],
                                comments_count: prevProfile.results[0].comments_count + 1,
                            },
                        ],
                    };
                } else {
                    return prevProfile;
                }
            });

            setComments((prevComments) => ({
                ...prevComments,
                results: prevComments.results.filter((comment) => comment.id !== id),
            }));
            toast.success("Comment deleted successfully");
        } catch (err) {
            let message = "Error, please try again later.";
            if (err.response?.data?.detail) {
                message = err.response?.data?.detail;
            } else if (err.message) {
                message = err.message;
            }
            toast.error(message);
        }
    };

    return (
        <>
            <hr />
            <Container>
                <div className="d-flex gap-3 justify-content-between">
                    <Link to={`/profiles/${profile_id}`}>
                        <Image className={styles.CommentImage} src={profile_image} alt={profile_id} roundedCircle />
                    </Link>
                    <div className="flex-grow-1">
                        <span className={styles.Owner}><Link to={`/profiles/${profile_id}`}>{owner}</Link></span>
                        <span className={styles.Date}>{updated_at}</span>
                        {showEditForm ? (
                            <CommentEditForm
                                id={id}
                                profile_id={profile_id}
                                content={content}
                                profileImage={profile_image}
                                setComments={setComments}
                                setShowEditForm={setShowEditForm}
                            />
                        ) : (
                            <p>{content}</p>
                        )}
                    </div>
                    {is_owner && !showEditForm && (
                        <MoreDropdown
                            handleEdit={() => setShowEditForm(true)}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
            </Container>
        </>
    );
};

Comment.propTypes = {
    profile_id: PropTypes.number,
    profile_image: PropTypes.string,
    owner: PropTypes.string,
    updated_at: PropTypes.string,
    content: PropTypes.string,
    id: PropTypes.number,
    setProfile: PropTypes.func,
    setComments: PropTypes.func,
};

export default Comment;