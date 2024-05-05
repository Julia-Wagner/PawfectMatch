import React, {useEffect, useState} from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import {useNavigate} from "react-router-dom";
import {Alert, FloatingLabel} from "react-bootstrap";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import {axiosReq} from "../../api/axiosDefaults";
import Asset from "../../components/Asset";

import Upload from "../../assets/upload.png"

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
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['link']
                ]
            },
            placeholder: "Add content to your post",
        });

        editor.on("text-change", () => {
            setPostData({
                ...postData,
                content: editor.root.innerHTML,
            });
        });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData();

        formData.append("title", title)
        formData.append("content", content)

        try {
            const {data} = await axiosReq.post('/posts/', formData);
            navigate(`/posts/${data.id}`)
        } catch (err) {
            if (err.response?.status !== 401) {
                setErrors(err.response?.data)
            }
        }
    }

    return (
        <Container>
            <h2 className="text-center my-3">Create a new post</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col className="p-0 p-md-2" sm={12} md={6}>
                        <Container className={appStyles.Content}>
                            <div className="text-center">
                                {errors?.title?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <FloatingLabel controlId="floatingTitle" label="Title" className="mb-3">
                                    <Form.Control type="text" name="title" value={title} onChange={handleChange} />
                                </FloatingLabel>
                                <div id="editor"></div>
                                {errors?.content?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}

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
                                    <Asset src={Upload} message="Click or tap to upload an image" />
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