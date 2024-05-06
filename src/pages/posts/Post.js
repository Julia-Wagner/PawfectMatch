import React from 'react'
import DOMPurify from 'dompurify';
import styles from "../../styles/Post.module.css"
import {useCurrentUser} from "../../contexts/CurrentUserContext";
import {Card, Image, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {MoreDropdown} from "../../components/MoreDropdown";
import {axiosRes} from "../../api/axiosDefaults";

const Post = (props) => {
    const {
        id,
        owner,
        is_owner,
        is_following,
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
        postPage,
    } = props;

    const currentUser = useCurrentUser();
    const navigate = useNavigate();

    // Sanitize HTML content to prevent security issues
    const sanitizedContent = React.useMemo(() => {
        return { __html: DOMPurify.sanitize(content) };
    }, [content]);

    const handleEdit = () => {
        navigate(`/posts/${id}/edit`);
    };

    const handleDelete = async () => {

    };

    return (
        <Card className={styles.Post}>
            <Card.Body className="d-flex justify-content-between flex-wrap">
                <div className="d-flex gap-4 flex-wrap">
                    <Link className="d-flex align-items-center gap-2" to={`/profiles/${profile_id}`}>
                        <Image src={profile_image} height={55} rounded />
                        {owner}
                    </Link>
                    <div className={styles.PostBar}>
                        {/*TODO: add onclick functions*/}
                        {is_owner ? (
                            <OverlayTrigger placement="top" overlay={<Tooltip>You can´t follow yourself!</Tooltip>}>
                                <span><i className="fa fa-plus-circle" /> Follow</span>
                            </OverlayTrigger>
                        ) : is_following ? (
                            <span onClick={()=>{}}>
                            <span className={styles.Heart}><i className="fa fa-check-circle" /> Following</span>
                        </span>
                        ) : currentUser ? (
                            <span onClick={()=>{}}>
                            <span className={styles.HeartOutline}><i className="fa fa-plus-circle" /> Follow</span>
                        </span>
                        ) : (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Log in to follow profiles!</Tooltip>}>
                                <span><i className="fa fa-plus-circle" /> Follow</span>
                            </OverlayTrigger>
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <span>{updated_at}</span>
                    {is_owner && postPage && (
                        <MoreDropdown
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
            </Card.Body>
            <Link to={`/posts/${id}`}>
                <Image src={main_image} width="100%" alt={title} />
            </Link>
            <Card.Body>
                {title && <h2 className="text-center">{title}</h2>}
                {sanitizedContent && !postPage && <Card.Text
                    className={styles.Truncate}
                    dangerouslySetInnerHTML={sanitizedContent}
                />}
                {sanitizedContent && postPage && <Card.Text
                    dangerouslySetInnerHTML={sanitizedContent}
                />}
                {!postPage && <Card.Link href={`/posts/${id}`}>View post</Card.Link>}
                <div className={styles.PostBar}>
                    {/*TODO: add onclick functions*/}
                    {is_owner ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>You can´t save your own post!</Tooltip>}>
                            <span>Save <i className="far fa-heart" /></span>
                        </OverlayTrigger>
                    ) : save_id ? (
                        <span onClick={()=>{}}>
                            <span className={styles.Heart}>Saved <i className="fas fa-heart" /></span>
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