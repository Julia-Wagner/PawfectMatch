import React, { useState } from "react";
import PropTypes from 'prop-types';

import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";

import styles from "../../styles/ProfilePage.module.css";
import btnStyles from "../../styles/Button.module.css";
import {toast} from "react-toastify";
import Alert from "react-bootstrap/Alert";

function CommentEditForm(props) {
    const { id, content, setShowEditForm, setComments } = props;

    const [formContent, setFormContent] = useState(content);

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setFormContent(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axiosRes.put(`/comments/${id}/`, {
                content: formContent.trim(),
            });
            setComments((prevComments) => ({
                ...prevComments,
                results: prevComments.results.map((comment) => {
                    return comment.id === id
                        ? {
                            ...comment,
                            content: formContent.trim(),
                            updated_at: "now",
                        }
                        : comment;
                }),
            }));
            setShowEditForm(false);
            setErrors({});
            toast.success("Comment edited successfully");
        } catch (err) {
            setErrors(err.response?.data);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
                <Form.Control
                    className={styles.Form}
                    as="textarea"
                    value={formContent}
                    onChange={handleChange}
                    rows={2}
                />
            </Form.Group>
            {errors.content?.map((message, idx) =>
                <Alert variant="warning" key={idx}>{message}</Alert>
            )}
            <div className="d-flex justify-content-end">
                <button
                    className={`${btnStyles.ReverseButton} ${btnStyles.Button}`}
                    onClick={() => setShowEditForm(false)}
                    type="button">
                    cancel
                </button>
                <button
                    className={`${btnStyles.Button}`}
                    disabled={!content.trim()}
                    type="submit">
                    save
                </button>
            </div>
        </Form>
    );
}

CommentEditForm.propTypes = {
    id: PropTypes.number,
    content: PropTypes.string,
    setShowEditForm: PropTypes.func,
    setComments: PropTypes.func,
};

export default CommentEditForm;