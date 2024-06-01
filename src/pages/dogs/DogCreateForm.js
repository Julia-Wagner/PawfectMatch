import React, {useEffect, useRef, useState} from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import {useNavigate} from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Figure from "react-bootstrap/Figure";
import Image from "react-bootstrap/Image";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import {axiosReq} from "../../api/axiosDefaults";
import Asset from "../../components/Asset";

import Upload from "../../assets/upload.png"
import Spinner from "react-bootstrap/Spinner";

function DogCreateForm() {
    const navigate = useNavigate();
    const quillRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleGoBack = () => {
        navigate(-1);
    }

    const [errors, setErrors] = useState({});

    const imageInput = useRef(null);

    const [dogData, setDogData] = useState({
        name: "",
        description: "",
        breed: "",
        birthday: "",
        size: "medium",
        gender: "male",
        is_adopted: false
    });
    const {
        name,
        description,
        breed,
        birthday,
        size,
        gender,
        is_adopted} = dogData;

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
        additional_images: [],
    });
    const { main_image, additional_images } = dogMediaData;

    const [videoData, setVideoData] = useState({
        video: null,
    });
    const { video } = videoData;

    const handleChangeMedia = (event) => {
        if (event.target.files.length) {
            const selectedFiles = Array.from(event.target.files);
            const selectedImages = selectedFiles.map(file => ({
                file,
                url: URL.createObjectURL(file),
                media_name: "",
                media_description: "",
            }));

            if (!main_image) {
                setDogMediaData({
                    main_image: selectedImages[0],
                    additional_images: selectedImages.slice(1),
                });
            } else {
                setDogMediaData((prevState) => ({
                    ...prevState,
                    additional_images: [...prevState.additional_images, ...selectedImages],
                }));
            }
        }
    }

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

    const handleRemoveImage = (index) => {
        setDogMediaData((prevState) => {
            const newImages = [...prevState.additional_images];
            newImages.splice(index, 1);
            return {
                ...prevState,
                additional_images: newImages
            };
        });
    };

    const handleMediaDataChange = (index, field, value) => {
        setDogMediaData((prevState) => {
            const newImages = [...prevState.additional_images];
            newImages[index] = {
                ...newImages[index],
                [field]: value,
            };
            return {
                ...prevState,
                additional_images: newImages
            };
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
                placeholder: "Add a description to your dog",
            });

            quillRef.current.on("text-change", () => {
                setDogData((prevDogData) => ({
                    ...prevDogData,
                    description: quillRef.current.root.innerHTML,
                }));
            });
        }
    }, []);

    useEffect(() => {
        // Fetch available dog characteristics
        const fetchDogCharacteristics = async () => {
            try {
                const {data} = await axiosReq.get("/dogs/characteristics/");
                setCharacteristics(data.results);
            } catch (error) {
                console.error("Error fetching dog characteristics:", error);
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
            const {data} = await axiosReq.post('/dogs/', formData);
            handleSubmitMedia(data.id);
        } catch (err) {
            if (err.response?.status !== 401) {
                setErrors(err.response?.data)
            }
        } finally {
            setLoading(false);
        }
    }

    const handleSubmitMedia = async (dog_id) => {
        if (main_image) {
            const formData = new FormData();
            formData.append("image", main_image.file);
            formData.append("name", name);
            formData.append("description", "");
            formData.append("type", "image");
            formData.append("is_main_image", true);

            try {
                await axiosReq.post(`/medias/dog/${dog_id}/`, formData);
            } catch (err) {
                if (err.response?.status !== 401) {
                    setErrors(err.response?.data);
                }
            }
        }

        for (let image of additional_images) {
            const formData = new FormData();
            formData.append("image", image.file);
            formData.append("name", image.media_name);
            formData.append("description", image.media_description);
            formData.append("type", "image");
            formData.append("is_main_image", false);

            try {
                await axiosReq.post(`/medias/dog/${dog_id}/`, formData);
            } catch (err) {
                if (err.response?.status !== 401) {
                    setErrors(err.response?.data);
                }
            }
        }

        if (video) {
            const formData = new FormData();
            formData.append("video", video.file);
            formData.append("name", name);
            formData.append("description", "");
            formData.append("type", "video");
            formData.append("is_main_image", false);

            try {
                await axiosReq.post(`/medias/dog/${dog_id}/`, formData);
            } catch (err) {
                if (err.response?.status !== 401) {
                    setErrors(err.response?.data);
                }
            }
        }

        navigate(`/dogs/${dog_id}`);
    }

    const today = new Date().toISOString().split("T")[0];

    return (
        <Container>
            <h2 className="text-center my-3">Create a new dog</h2>
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
                                    <Form.Select multiple onChange={handleSelectChange}>
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
                                            "Create Dog"
                                        )}
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
                                        </div>
                                    </>
                                ) : (
                                    <Form.Label
                                        className="d-flex justify-content-center"
                                        htmlFor="main-image-upload"
                                    >
                                        <Asset src={Upload} message="Click or tap to upload an image" />
                                    </Form.Label>
                                )}
                                <Form.Control id="main-image-upload" type="file" onChange={handleChangeMedia} ref={imageInput} />
                            </Form.Group>
                            {errors?.main_image?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            ))}
                            <Form.Group className="text-center">
                                <h4 className="mt-3">Video</h4>
                                <p>You can upload a video that will be shown for the dog.</p>
                                {video ? (
                                    <>
                                        <video className={appStyles.Video} controls>
                                            <source src={video.url} type="video/mp4" />
                                        </video>
                                        <div>
                                            <Form.Label className={`mb-3 ${btnStyles.Button}`} htmlFor="video-upload">
                                                Change the video
                                            </Form.Label>
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
                                <p>You can upload additional images that will be shown in a slider.</p>
                                <Form.Label className="d-flex justify-content-center" htmlFor="additional-image-upload">
                                    <Asset src={Upload} message="Click or tap to upload images" />
                                </Form.Label>
                                <div>
                                    <Form.Label className={`mb-3 ${btnStyles.Button}`} htmlFor="additional-image-upload">
                                        Add another image
                                    </Form.Label>
                                </div>
                                <Form.Control id="additional-image-upload" type="file" multiple onChange={handleChangeMedia} />

                                <div className="mt-3">
                                    {additional_images.map((image, index) => (
                                        <div key={index} className="mt-5 position-relative">
                                            <Figure>
                                                <Image className={appStyles.Image} src={image.url} rounded />
                                            </Figure>
                                            <Button variant="danger" className="position-absolute top-0 end-0" onClick={() => handleRemoveImage(index)}>
                                                Remove
                                            </Button>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Media Name</Form.Label>
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
                                        </div>
                                    ))}
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

export default DogCreateForm;