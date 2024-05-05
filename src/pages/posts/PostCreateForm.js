import React, {useEffect, useState} from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import {useNavigate} from "react-router-dom";
import {FloatingLabel} from "react-bootstrap";

import Quill from "quill";
import "quill/dist/quill.snow.css";

function PostCreateForm() {

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }

    const [errors, setErrors] = useState({});

    const [postData, setPostData] = useState({
        title: "",
        content: "",
    });
    const {title, content} = postData;

    const handleChange = (event) => {
        setPostData({
            ...postData,
            [event.target.name]: event.target.value,
        });
    };

    // Initialize Quill editor
    useEffect(() => {
        const editor = new Quill("#editor", {
            theme: "snow",
            placeholder: "Add content to your post",
            modules: {
                clipboard: {
                    matchVisual: false
                }
            }
        });
    }, []);

    return (
        <Container>
            <h2 className="text-center my-3">Create a new post</h2>
            <Form>
                <Row>
                    <Col className="p-0 p-md-2" sm={12} md={6}>
                        <Container className={appStyles.Content}>
                            <div className="text-center">
                                <FloatingLabel controlId="floatingTitle" label="Title" className="mb-3">
                                    <Form.Control type="text" name="title" value={title} onChange={handleChange} />
                                </FloatingLabel>
                                <div id="editor"></div>

                                <div className="mt-4">
                                    <Button className={`${btnStyles.ReverseButton} ${btnStyles.Button}`}
                                            onClick={handleGoBack}>
                                        Go back
                                    </Button>
                                    <Button className={`${btnStyles.Button}`} type="submit">
                                        Create Post
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </Col>
                    <Col className="py-2 p-0 p-md-2" sm={12} md={6}>
                        <Container
                            className={`${appStyles.Content} d-flex flex-column justify-content-center`}
                        >
                            <Form.Group className="text-center">

                                <Form.Label
                                    className="d-flex justify-content-center"
                                    htmlFor="image-upload"
                                >
                                    MEDIAS
                                </Form.Label>

                            </Form.Group>
                        </Container>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default PostCreateForm;