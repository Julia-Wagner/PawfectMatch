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

function DogEditForm() {
    const {id} = useParams();
    const navigate = useNavigate();
    const quillRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleGoBack = () => {
        navigate(-1);
    }

    const [dogData, setDogData] = useState({
        name: "",
        description: "",
        breed: "",
        birthday: "",
        size: "medium",
        gender: "male",
        is_adopted: false
    });
    const { name, description, breed, birthday, size, gender, is_adopted } = dogData;

    const [characteristics, setCharacteristics] = useState([]);
    const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target;
        setDogData({
            ...dogData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const [dogMediaData, setDogMediaData] = useState({
        main_image: null,
        more_images: [],
    });
    const { main_image, more_images } = dogMediaData;

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
            setDogMediaData((prevState) => ({
                ...prevState,
                main_image: selectedImages[0],
            }));
        }
    }

    const handleAdditionalImagesChange = (event) => {
        if (event.target.files.length) {
            const selectedFiles = Array.from(event.target.files);
            const newImages = selectedFiles.map(file => ({
                file,
                url: URL.createObjectURL(file),
                media_name: "",
                media_description: "",
            }));
            setDogMediaData((prevState) => ({
                ...prevState,
                more_images: [...prevState.more_images, ...newImages],
            }));
        }
    };

    // remove a newly added additional image
    const handleRemoveImage = (index) => {
        setDogMediaData((prevState) => {
            const newImages = [...prevState.more_images];
            newImages.splice(index, 1);
            return {
                ...prevState,
                more_images: newImages
            };
        });
    };

    // update name and description for additional images
    const handleMediaDataChange = (index, field, value) => {
        setDogMediaData((prevState) => {
            const newImages = [...prevState.more_images];
            newImages[index] = {
                ...newImages[index],
                [field]: value,
            };
            return {
                ...prevState,
                more_images: newImages
            };
        });
    };

    const [videoData, setVideoData] = useState({
        video: null,
    });
    const { video } = videoData;

    const handleChangeVideo = (event) => {
        if (event.target.files.length) {
            const selectedFile = event.target.files[0];
            setVideoData({
                video: {
                    file: selectedFile,
                    url: URL.createObjectURL(selectedFile),
                },
            });
        }
    };

    // delete a main image, video or additional image
    const handleDeleteMedia = async (mediaId) => {
        try {
            await axiosReq.delete(`/medias/${mediaId}/`);
            if (mediaId === main_image.id) {
                setDogMediaData({ ...dogMediaData, main_image: null });
            } else if (mediaId === video.id) {
                setVideoData({ ...videoData, video: null });
            }
            toast.success("Media deleted successfully");
        } catch (err) {
            let message = "Error, please try again later.";
            if (err.response?.data?.detail) {
                message = err.response?.data?.detail;
            } else if (err.message) {
                message = err.message;
            }
            toast.error(message);
        }
    };

    useEffect(() => {
        const handleMount = async () => {
            try {
                const {data} = await axiosReq.get(`/dogs/${id}/`)
                const {
                    name,
                    description,
                    breed,
                    birthday,
                    size,
                    gender,
                    is_adopted,
                    characteristics,
                    is_owner,
                    main_image,
                    video,
                    additional_images} = data;

                if (is_owner) {
                    setDogData({
                        name,
                        description,
                        breed,
                        birthday,
                        size,
                        gender,
                        is_adopted});
                    setSelectedCharacteristics(characteristics);

                    const formattedAdditionalImages = additional_images.map(image => ({
                        id: image.id,
                        url: image.image,
                        media_name: image.name || "",
                        media_description: image.description || "",
                    }));

                    setDogMediaData({
                        main_image,
                        more_images: formattedAdditionalImages,
                    });
                    if (video) {
                        setVideoData({video});
                    }
                } else {
                    navigate("/feed");
                }
            } catch (err) {
                let message = "Error, please try again later.";
                if (err.response?.data?.detail) {
                    message = err.response?.data?.detail;
                } else if (err.message) {
                    message = err.message;
                }
                toast.error(message);
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
                placeholder: "Add a description to your dog",
            });

            quillRef.current.on("text-change", () => {
                setDogData((prevDogData) => ({
                    ...prevDogData,
                    description: quillRef.current.root.innerHTML,
                }));
            });
        }

        if (quillRef.current && quillRef.current.root.innerHTML !== dogData.description) {
            quillRef.current.root.innerHTML = dogData.description;
        }
    }, [dogData.description]);

    useEffect(() => {
        // Fetch available dog characteristics
        const fetchDogCharacteristics = async () => {
            try {
                const {data} = await axiosReq.get("/dogs/characteristics/");
                setCharacteristics(data.results);
            } catch (error) {
                let message = "Error, please try again later.";
                if (err.response?.data?.detail) {
                    message = err.response?.data?.detail;
                } else if (err.message) {
                    message = err.message;
                }
                toast.error(message);
            }
        };

        fetchDogCharacteristics();
    }, []);

    const handleSelectChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedCharacteristics(selectedOptions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true);
        const formData = new FormData();

        formData.append("name", name)
        formData.append("description", description)
        formData.append("breed", breed)
        formData.append("birthday", birthday)
        formData.append("size", size)
        formData.append("gender", gender)
        formData.append("is_adopted", is_adopted)

        if (selectedCharacteristics.length > 0 && selectedCharacteristics[0] !== "") {
            selectedCharacteristics.forEach((characteristic) => {
                formData.append("characteristics", characteristic);
            });
        }

        try {
            const {data} = await axiosReq.put(`/dogs/${id}/`, formData);
            // check if a video was uploaded
            if (video && video.file) {
                await handleSubmitVideo(id, data.video);
            }

            // check if additional images were uploaded
            if (more_images && more_images.length > 0) {
                await handleSubmitAdditionalMedia(id);
            }

            // check if a main image was uploaded
            if (main_image && main_image.file) {
                // check if the image changed
                if (main_image.id !== data.main_image.id) {
                    await handleSubmitMedia(id, data.main_image.id);
                    navigate(`/dogs/${id}`);
                } else {
                    navigate(`/dogs/${id}/`)
                }
            } else {
                navigate(`/dogs/${id}/`)
            }
            toast.success("Dog edited successfully");
        } catch (err) {
            setErrors(err.response?.data)
            toast.warning("Please check your data again");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmitVideo = async (dog_id, video_obj) => {
        if (video && video.file) {
            const videoFormData = new FormData();
            videoFormData.append("video", video.file);
            videoFormData.append("name", name);
            videoFormData.append("description", "");
            videoFormData.append("type", "video");
            videoFormData.append("is_main_image", false);

            try {
                if (video_obj) {
                    // change the media if another video was uploaded before
                    await axiosReq.put(`/medias/${video_obj.id}/`, videoFormData);
                } else {
                    // create a new media if no video was uploaded before
                    await axiosReq.post(`/medias/dog/${dog_id}/`, videoFormData);
                }
            } catch (err) {
                setErrors(err.response?.data);
                toast.warning("Please check your data again");
            }
        }
    }

    const handleSubmitMedia = async (dog_id, image_id) => {
        const formData = new FormData();

        if (main_image && main_image.file) {
            formData.append("image", main_image.file);
            formData.append("name", name);
            formData.append("description", main_image.media_description || "");
            formData.append("type", "image");
            formData.append("is_main_image", true);

            try {
                if (image_id) {
                    // change the media if another image was uploaded before
                    await axiosReq.put(`/medias/${image_id}/`, formData);
                } else {
                    // create a new media if no image was uploaded before
                    await axiosReq.post(`/medias/dog/${dog_id}/`, formData);
                }
            } catch (err) {
                setErrors(err.response?.data);
                toast.warning("Please check your data again");
            }
        }
    }

    const handleSubmitAdditionalMedia = async (dog_id) => {
        for (let image of more_images) {
            if (image.file) {
                const imageFormData = new FormData();
                imageFormData.append("image", image.file);
                imageFormData.append("name", image.media_name || name);
                imageFormData.append("description", image.media_description);
                imageFormData.append("type", "image");
                imageFormData.append("is_main_image", false);

                try {
                    await axiosReq.post(`/medias/dog/${dog_id}/`, imageFormData);
                } catch (err) {
                    setErrors(err.response?.data);
                    toast.warning("Please check your data again");
                }
            }
        }
    }

    const today = new Date().toISOString().split("T")[0];

    return (
        <Container>
            <h2 className="text-center my-3">Edit dog</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col className="p-0 p-md-2" sm={12} md={6}>
                        <Container className={appStyles.Content}>
                            <div className="text-center">
                                <Form.Group controlId="name" className="mb-4">
                                    <Form.Label>Name *</Form.Label>
                                    <Form.Control type="text" name="name" value={name} onChange={handleChange} />
                                </Form.Group>
                                {errors?.name?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group controlId="editor" className="mb-4">
                                    <Form.Label>Description</Form.Label>
                                    <div id="editor"></div>
                                </Form.Group>
                                {errors?.description?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group controlId="breed" className="mb-4">
                                    <Form.Label>Breed *</Form.Label>
                                    <Form.Control type="text" name="breed" value={breed} onChange={handleChange} />
                                </Form.Group>
                                {errors?.breed?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group controlId="birthday" className="mb-4">
                                    <Form.Label>Birthday *</Form.Label>
                                    <Form.Control type="date" name="birthday" value={birthday} onChange={handleChange} max={today} />
                                </Form.Group>
                                {errors?.birthday?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group controlId="size" className="mb-4">
                                    <Form.Label>Size *</Form.Label>
                                    <Form.Select value={size} name="size" onChange={handleChange}>
                                        <option key="small" value="small">Small</option>
                                        <option key="medium" value="medium">Medium</option>
                                        <option key="big" value="big">Big</option>
                                    </Form.Select>
                                </Form.Group>
                                {errors?.gender?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group controlId="gender" className="mb-4">
                                    <Form.Label>Gender *</Form.Label>
                                    <Form.Select value={gender} name="gender" onChange={handleChange}>
                                        <option key="male" value="male">Male</option>
                                        <option key="female" value="female">Female</option>
                                    </Form.Select>
                                </Form.Group>
                                {errors?.gender?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group controlId="characteristics" className="mb-4">
                                    <Form.Label>Add characteristics of the dog</Form.Label>
                                    <Form.Select multiple value={selectedCharacteristics} onChange={handleSelectChange}>
                                        <option value="">No characteristics</option>
                                        {characteristics.map((characteristic) => (
                                            <option key={characteristic.id} value={characteristic.id}>{characteristic.characteristic}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group controlId="adopted" className="mb-4 d-flex justify-content-center gap-2">
                                    <Form.Label>Adopted?</Form.Label>
                                    <Form.Check type="checkbox" name="is_adopted" value={is_adopted} onChange={handleChange} />
                                </Form.Group>
                                {errors?.is_adopted?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}

                                <div className="mt-4">
                                    <Button className={`${btnStyles.ReverseButton} ${btnStyles.Button}`}
                                            onClick={handleGoBack} disabled={loading}>
                                        Go back
                                    </Button>
                                    <Button className={`${btnStyles.Button}`} type="submit" disabled={loading}>
                                        {loading ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            "Save Dog"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </Col>
                    <Col className="py-2 p-0 p-md-2" sm={12} md={6}>
                        <Container
                            className={`${appStyles.Content} d-flex flex-column justify-content-center`}>
                            <Form.Group className="text-center">
                                <h3 className="mt-3">Main image</h3>
                                {main_image ? (
                                    <>
                                        <Figure>
                                            <Image className={appStyles.Image} src={main_image.url} rounded />
                                        </Figure>
                                        <div>
                                            <Form.Label className={`mb-3 ${btnStyles.Button}`} htmlFor="main-image-upload">
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
                                        htmlFor="main-image-upload">
                                        <Asset src={Upload} message="Click or tap to upload an image" />
                                    </Form.Label>
                                )}
                                <Form.Control id="main-image-upload" type="file" onChange={handleChangeMedia} />
                            </Form.Group>
                            {errors?.main_image?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            ))}
                            <Form.Group className="text-center">
                                <h4 className="mt-3">Video</h4>
                                <p>You can upload a video that will be shown for the dog.</p>
                                {video && video.url ? (
                                    <>
                                        <video className={appStyles.Video} controls key={video.url}>
                                            <source src={video.url} type="video/mp4" />
                                        </video>
                                        <div>
                                            <Form.Label className={`mb-3 ${btnStyles.Button}`} htmlFor="video-upload">
                                                Change the video
                                            </Form.Label>
                                            {video.id && (
                                                <Button
                                                    variant="danger"
                                                    className={`${btnStyles.Button} ${btnStyles.DeleteButton}`}
                                                    onClick={() => handleDeleteMedia(video.id)}>
                                                    Delete Video
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <Form.Label className="d-flex justify-content-center" htmlFor="video-upload">
                                        <Asset src={Upload} message="Click or tap to upload a video" />
                                    </Form.Label>
                                )}
                                <Form.Control id="video-upload" type="file" accept="video/*" onChange={handleChangeVideo} />
                            </Form.Group>
                            {errors?.video?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            ))}
                            <Form.Group className="text-center">
                                <h4 className="mt-5">Additional images</h4>
                                <Form.Label className="d-flex justify-content-center" htmlFor="additional-image-upload">
                                    <Asset src={Upload} message="Click or tap to upload images" />
                                </Form.Label>
                                <div>
                                    <Form.Label className={`mb-3 ${btnStyles.Button}`} htmlFor="additional-image-upload">
                                        Add another image
                                    </Form.Label>
                                </div>
                                <Form.Control id="additional-image-upload" type="file" multiple onChange={handleAdditionalImagesChange} />

                                <div className="mt-3">
                                    {more_images && more_images.length > 0 && (
                                        <>
                                            {more_images.map((image, index) => (
                                                <div key={index} className="mt-5 position-relative">
                                                    <Figure>
                                                        <Image className={appStyles.Image} src={image.url} rounded />
                                                    </Figure>
                                                    <div className="mb-3">
                                                        {image.id ? (
                                                            <Button
                                                                variant="danger"
                                                                className={`${btnStyles.Button} ${btnStyles.DeleteButton}`}
                                                                onClick={() => {
                                                                    handleDeleteMedia(image.id);
                                                                    handleRemoveImage(index);
                                                                }}>
                                                                Delete Image
                                                            </Button>
                                                        ) : (
                                                            <Button variant="danger" className="position-absolute top-0 end-0" onClick={() => handleRemoveImage(index)}>
                                                                Remove
                                                            </Button>
                                                        )}
                                                    </div>
                                                    {image.id ? (
                                                        <>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Media Name (*)</Form.Label>
                                                                <Form.Control type="text" disabled value={image.media_name} />
                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Media Description</Form.Label>
                                                                <Form.Control type="text" disabled value={image.media_description} />
                                                            </Form.Group>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Media Name (*)</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={image.media_name}
                                                                    onChange={(e) => handleMediaDataChange(index, 'media_name', e.target.value)}
                                                                />
                                                            </Form.Group>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Media Description</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={image.media_description}
                                                                    onChange={(e) => handleMediaDataChange(index, 'media_description', e.target.value)}
                                                                />
                                                            </Form.Group>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </Form.Group>
                            {errors?.additional_images?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            ))}
                        </Container>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default DogEditForm;