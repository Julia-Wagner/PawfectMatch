import React, {useState} from "react"
import DOMPurify from 'dompurify';
import appStyles from "../../App.module.css";
import styles from "../../styles/Post.module.css"
import {useCurrentUser} from "../../contexts/CurrentUserContext";
import {Card, Image, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {MoreDropdown} from "../../components/MoreDropdown";
import {axiosRes} from "../../api/axiosDefaults";
import ConfirmationModal from "../../components/ConfirmationModal";

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
        setPosts,
    } = props;

    const currentUser = useCurrentUser();
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Sanitize HTML content to prevent security issues
    const sanitizedContent = React.useMemo(() => {
        return { __html: DOMPurify.sanitize(content) };
    }, [content]);

    const handleEdit = () => {
        navigate(`/posts/${id}/edit`);
    };

    const handleDelete = async () => {
        setShowConfirmation(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosRes.delete(`/posts/${id}/`);
            navigate(-1);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSave = async () => {
        try {
            const {data} = await axiosRes.post('/saves/', {post: id});
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                    ? {...post, saves_count: post.saves_count + 1, save_id: data.id}
                        : post;
                }),
            }));
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnsave = async () => {
        try {
            const {data} = await axiosRes.delete(`/saves/${save_id}`);
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                    ? {...post, saves_count: post.saves_count - 1, save_id: null}
                        : post;
                }),
            }));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Card className={styles.Post}>
            <Card.Body className="d-flex justify-content-between flex-wrap">
                <div className="d-flex gap-4 flex-wrap">
                    <Link className="d-flex align-items-center gap-2" to={`/profiles/${profile_id}`}>
                        <Image className={styles.ProfileImage} src={profile_image} roundedCircle />
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
                            <span className={`${styles.Heart} ${appStyles.Pointer}`}><i className="fa fa-check-circle" /> Following</span>
                        </span>
                        ) : currentUser ? (
                            <span onClick={()=>{}}>
                            <span className={`${styles.HeartOutline} ${appStyles.Pointer}`}><i className="fa fa-plus-circle" /> Follow</span>
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
                    {is_owner ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>You can´t save your own post!</Tooltip>}>
                            <span>Save <i className="far fa-heart" /></span>
                        </OverlayTrigger>
                    ) : save_id ? (
                        <span onClick={handleUnsave}>
                            <span className={`${styles.Heart} ${appStyles.Pointer}`}>Saved <i className="fas fa-heart" /></span>
                        </span>
                    ) : currentUser ? (
                        <span onClick={handleSave}>
                            <span className={`${styles.HeartOutline} ${appStyles.Pointer}`}>Save <i className="far fa-heart" /></span>
                        </span>
                    ) : (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Log in to save posts!</Tooltip>}>
                            <span>Save <i className="far fa-heart" /></span>
                        </OverlayTrigger>
                    )}
                    <span className="fw-bold">{saves_count}</span>
                </div>
            </Card.Body>
            <ConfirmationModal title="Confirm deletion" text="Are you sure you want to delete this post?"
                show={showConfirmation}
                onHide={() => setShowConfirmation(false)}
                onConfirm={handleConfirmDelete}
            />
        </Card>
    )
}

export default Post