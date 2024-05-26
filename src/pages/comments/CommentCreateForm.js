import React, {useState} from "react";
import {Link} from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/ProfilePage.module.css";
import {axiosRes} from "../../api/axiosDefaults";
import {Alert, Button, Image} from "react-bootstrap";
import btnStyles from "../../styles/Button.module.css";

function CommentCreateForm(props) {
    const { profile, setProfile, setComments, commenter_image, commenter_id } = props;
    const [content, setContent] = useState("");

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setContent(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axiosRes.post("/comments/", {
                content,
                profile,
            });
            setComments((prevComments) => ({
                ...prevComments,
                results: [data, ...prevComments.results],
            }));
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
            setContent("");
            setErrors({});
        } catch (err) {
            setErrors(err.response?.data);
        }
    };

    return (
        <Form className="mt-2" onSubmit={handleSubmit}>
            <Form.Group>
                <InputGroup className="d-flex align-items-center gap-2 mb-2">
                    <Link to={`/profiles/${commenter_id}`}>
                        <Image className={styles.CommentImage} src={commenter_image} alt={commenter_id} roundedCircle />
                    </Link>
                    <Form.Control
                        className={styles.Form}
                        placeholder="add a comment..."
                        as="textarea"
                        value={content}
                        onChange={handleChange}
                        rows={2}
                    />
                </InputGroup>
                {errors.content?.map((message, idx) =>
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}
            </Form.Group>
            <div className="d-flex justify-content-end">
                <Button
                    className={`${btnStyles.Button} mt-3`}
                    disabled={!content.trim()}
                    type="submit">
                    add comment
                </Button>
            </div>
        </Form>
    );
}

export default CommentCreateForm;