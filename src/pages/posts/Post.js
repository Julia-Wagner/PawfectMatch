import React from 'react'
import styles from "../../styles/Post.module.css"
import {useCurrentUser} from "../../contexts/CurrentUserContext";
import {Card, Image} from "react-bootstrap";
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
            <Card.Body>
                <Link className="d-flex align-items-center gap-2" to={`/profiles/${profile_id}`}>
                    <Image src={profile_image} height={55} rounded />
                    {owner}
                </Link>
            </Card.Body>
            <Link to={`/posts/${id}`}>
                <Card.Img src={main_image} alt={title} />
            </Link>
            <Card.Body>
                <div className="d-flex align-items-center justify-content-end">
                    <span>{updated_at}</span>
                </div>
                {title && <Card.Title className="text-center">{title}</Card.Title>}
                {content && <Card.Text>{content}</Card.Text>}
            </Card.Body>
        </Card>
    )
}

export default Post