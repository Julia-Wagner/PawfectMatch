import React, {useEffect, useRef, useState} from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import {useNavigate} from "react-router-dom";
import {Alert} from "react-bootstrap";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import {axiosReq} from "../../api/axiosDefaults";
import Asset from "../../components/Asset";

import Upload from "../../assets/upload.png"
import {useIsShelterUser} from "../../contexts/CurrentUserContext";

function PostCreateForm() {
    const isShelterUser = useIsShelterUser();
    const navigate = useNavigate();
    const quillRef = useRef(null);

    const handleGoBack = () => {
        navigate(-1);
    }

    const [errors, setErrors] = useState({});

    const [postData, setPostData] = useState({
        title: "",
        content: "",
    });
    const {title, content} = postData;

    const [dogs, setDogs] = useState([]);
    const [selectedDogs, setSelectedDogs] = useState([]);

    const handleChange = (event) => {
        setPostData({
            ...postData,
            [event.target.name]: event.target.value,
        });
    };

    useEffect(() => {
        if (!quillRef.current) {
            quillRef.current = new Quill("#editor", {
                theme: "snow",
                modules: {
                    toolbar: [
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link"],
                    ],
                },
                placeholder: "Add content to your post",
            });

            quillRef.current.on("text-change", () => {
                setPostData((prevPostData) => ({
                    ...prevPostData,
                    content: quillRef.current.root.innerHTML,
                }));
            });
        }
    }, []);

    useEffect(() => {
        // Fetch the current user's dogs
        const fetchUserDogs = async () => {
            try {
                const response = await axiosReq.get("/dogs");
                const userDogs = response.data.results.filter(dog => dog.is_owner);
                setDogs(userDogs);
            } catch (error) {
                console.error("Error fetching user's dogs:", error);
            }
        };

        fetchUserDogs();
    }, []);

    const handleSelectChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedDogs(selectedOptions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData();

        formData.append("title", title)
        formData.append("content", content)

        if (selectedDogs.length > 0 && selectedDogs[0] !== "") {
            formData.append("dogs", selectedDogs);
        }

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
                                <Form.Group className="mb-4">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" name="title" value={title} onChange={handleChange} />
                                </Form.Group>
                                {errors?.title?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group className="mb-4">
                                    <Form.Label>Content</Form.Label>
                                    <div id="editor"></div>
                                </Form.Group>
                                {errors?.content?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                {isShelterUser && (
                                    <Form.Group className="mt-4">
                                        <Form.Label>Link dogs to the post</Form.Label>
                                        <Form.Select multiple onChange={handleSelectChange}>
                                            <option value="">No dogs</option>
                                            {dogs.map((dog) => (
                                                <option key={dog.id} value={dog.id}>{dog.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}

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