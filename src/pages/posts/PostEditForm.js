import React, {useEffect, useRef, useState} from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import {useNavigate, useParams} from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Figure from "react-bootstrap/Figure";
import Image from "react-bootstrap/Image";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import {axiosReq} from "../../api/axiosDefaults";
import Asset from "../../components/Asset";

import Upload from "../../assets/upload.png"
import Spinner from "react-bootstrap/Spinner";
import {toast} from "react-toastify";

function PostEditForm() {
    const {id} = useParams();

    const navigate = useNavigate();
    const quillRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleGoBack = () => {
        navigate(-1);
    }

    const [errors, setErrors] = useState({});

    const [postData, setPostData] = useState({
        title: "",
        content: "",
    });
    const {title, content} = postData;

    const [postMediaData, setPostMediaData] = useState({
        main_image: null,
    });
    const { main_image } = postMediaData;

    const [dogs, setDogs] = useState([]);
    const [selectedDogs, setSelectedDogs] = useState([]);

    const handleChange = (event) => {
        setPostData({
            ...postData,
            title: event.target.value,
        });
    };

    const handleChangeMedia = (event) => {
        if (event.target.files.length) {
            const selectedFiles = Array.from(event.target.files);
            const selectedImages = selectedFiles.map(file => ({
                file,
                url: URL.createObjectURL(file),
                media_name: "",
                media_description: "",
            }));
            URL.revokeObjectURL(main_image);
            setPostMediaData({
                main_image: selectedImages[0]
            })
        }
    }

    useEffect(() => {
        const handleMount = async () => {
            try {
                const {data} = await axiosReq.get(`/posts/${id}/`)
                const {title, content, dogs, is_owner, main_image} = data;

                if (is_owner) {
                    setPostData({title, content});
                    setSelectedDogs(dogs);
                    setPostMediaData({
                        main_image,
                    })
                } else {
                    navigate("/feed");
                }
            } catch (err) {
                // console.log(err);
            }
        }

        handleMount();
    }, [navigate, id]);

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

        if (quillRef.current && quillRef.current.root.innerHTML !== postData.content) {
            quillRef.current.root.innerHTML = postData.content;
        }
    }, [postData.content]);

    useEffect(() => {
        // Fetch the current user's dogs
        const fetchUserDogs = async () => {
            try {
                const response = await axiosReq.get("/dogs/");
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
        setLoading(true);
        const formData = new FormData();

        formData.append("title", title)
        formData.append("content", content)

        if (selectedDogs.length > 0 && selectedDogs[0] !== "") {
            selectedDogs.forEach((dog) => {
                formData.append("dogs", dog);
            });
        }

        try {
            const {data} = await axiosReq.put(`/posts/${id}/`, formData);
            // check if a main image was uploaded
            if (main_image && main_image.file) {
                // check if the image changed
                if (main_image.id !== data.main_image.id) {
                    await handleSubmitMedia(id, data.main_image.id);
                    navigate(`/posts/${id}`)
                } else {
                    navigate(`/posts/${id}/`)
                }
            } else {
                navigate(`/posts/${id}/`)
            }
            toast.success("Post edited successfully");
        } catch (err) {
            setErrors(err.response?.data)
            toast.warning("Please check your data again");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmitMedia = async (post_id, image_id) => {
        const formData = new FormData();

        if (main_image && main_image.file) {
            formData.append("image", main_image.file)
            formData.append("name", title)
            formData.append("description", main_image.media_description || "");
            formData.append("type", "image");
            formData.append("is_main_image", true);

            try {
                if (image_id) {
                    // change the media if another image was uploaded before
                    await axiosReq.put(`/medias/${image_id}/`, formData);
                } else {
                    // create a new media if no image was uploaded before
                    await axiosReq.post(`/medias/post/${post_id}/`, formData);
                }
            } catch (err) {
                if (err.response?.status !== 401) {
                    setErrors(err.response?.data)
                }
            }
        }
    }

    const handleDeleteMedia = async (mediaId) => {
        try {
            await axiosReq.delete(`/medias/${mediaId}/`);
            setPostMediaData({ ...postMediaData, main_image: null });
        } catch (err) {
            // console.log(err);
        }
    };

    return (
        <Container>
            <h2 className="text-center my-3">Edit post</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col className="p-0 p-md-2" sm={12} md={6}>
                        <Container className={appStyles.Content}>
                            <div className="text-center">
                                <Form.Group controlId="title" className="mb-4">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" name="title" value={title} onChange={handleChange} />
                                </Form.Group>
                                {errors?.title?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group controlId="content" className="mb-4">
                                    <Form.Label>Content</Form.Label>
                                    <div id="editor"></div>
                                </Form.Group>
                                {errors?.content?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group controlId="dogs" className="mt-4">
                                    <Form.Label>Link dogs to the post</Form.Label>
                                    <Form.Select multiple value={selectedDogs} onChange={handleSelectChange}>
                                        <option value="">No dogs</option>
                                        {dogs.map((dog) => (
                                            <option key={dog.id} value={dog.id}>{dog.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <div className="mt-4">
                                    <Button className={`${btnStyles.ReverseButton} ${btnStyles.Button}`}
                                            onClick={handleGoBack} disabled={loading}>
                                        Go back
                                    </Button>
                                    <Button className={`${btnStyles.Button}`} type="submit" disabled={loading}>
                                        {loading ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            "Save Post"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </Col>
                    <Col className="py-2 p-0 p-md-2" sm={12} md={6}>
                        <Container className={`${appStyles.Content} d-flex flex-column justify-content-center`}>
                            <Form.Group className="text-center">
                                {main_image ? (
                                    <>
                                        <Figure>
                                            <Image className={appStyles.Image} src={main_image.url} rounded />
                                        </Figure>
                                        <div>
                                            <Form.Label className={`mb-3 ${btnStyles.Button}`} htmlFor="media-upload">
                                                Change the image
                                            </Form.Label>
                                            {main_image.id && (
                                                <Button
                                                    variant="danger"
                                                    className={`${btnStyles.Button} ${btnStyles.DeleteButton}`}
                                                    onClick={() => handleDeleteMedia(main_image.id)}>
                                                    Delete Image
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <Form.Label
                                        className="d-flex justify-content-center"
                                        htmlFor="media-upload"
                                    >
                                        <Asset src={Upload} message="Click or tap to upload an image" />
                                    </Form.Label>
                                )}
                                <Form.Control id="media-upload" type="file" onChange={handleChangeMedia} />
                            </Form.Group>
                            {errors?.main_image?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            ))}
                        </Container>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default PostEditForm;