import React from 'react'
import styles from "../../styles/Post.module.css"
import {useCurrentUser} from "../../contexts/CurrentUserContext";
import {Card, Image, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Link} from "react-router-dom";

const Post = (props) => {
    const {
        id,
        owner,
        profile_id,
        profile_image,
        saves_count,
        save_id,
        title,
        type,
        content,
        dogs,
        main_image,
        created_at,
        updated_at,
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner

    return (
        <Card className={styles.Post}>
            <Card.Body className="d-flex justify-content-between">
                <Link className="d-flex align-items-center gap-2" to={`/profiles/${profile_id}`}>
                    <Image src={profile_image} height={55} rounded />
                    {owner}
                </Link>
                <div className="d-flex align-items-center">
                    <span>{updated_at}</span>
                </div>
            </Card.Body>
            <Link to={`/posts/${id}`}>
                <Card.Img src={main_image} alt={title} />
            </Link>
            <Card.Body>
                {title && <Card.Title className="text-center">{title}</Card.Title>}
                {content && <Card.Text>{content}</Card.Text>}
                <div className={styles.PostBar}>
                    {is_owner ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>You can´t save your own post!</Tooltip>}>
                            <span>Save <i className="far fa-heart" /></span>
                        </OverlayTrigger>
                    ) : save_id ? (
                        <span onClick={()=>{}}>
                            <span className={styles.Heart}>Save <i className="fas fa-heart" /></span>
                        </span>
                    ) : currentUser ? (
                        <span onClick={()=>{}}>
                            <span className={styles.HeartOutline}>Save <i className="far fa-heart" /></span>
                        </span>
                    ) : (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Log in to save posts!</Tooltip>}>
                            <span>Save <i className="far fa-heart" /></span>
                        </OverlayTrigger>
                    )}
                    <span className="fw-bold">{saves_count}</span>
                </div>
            </Card.Body>
        </Card>
    )
}

export default Post