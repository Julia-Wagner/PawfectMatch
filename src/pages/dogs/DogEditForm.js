import React, {useEffect, useRef, useState} from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import {useNavigate, useParams} from "react-router-dom";
import {Alert} from "react-bootstrap";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import {axiosReq} from "../../api/axiosDefaults";
import Asset from "../../components/Asset";

import Upload from "../../assets/upload.png"
import {useIsShelterUser} from "../../contexts/CurrentUserContext";

function DogEditForm() {
    const isShelterUser = useIsShelterUser();
    const {id} = useParams();

    const navigate = useNavigate();
    const quillRef = useRef(null);

    const handleGoBack = () => {
        navigate(-1);
    }

    const [errors, setErrors] = useState({});

    const [dogData, setDogData] = useState({
        name: "",
        description: "",
        breed: "",
        birthday: "",
        size: "",
        gender: "",
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
                    is_owner} = data;

                is_owner ? setDogData({name,
                    description,
                    breed,
                    birthday,
                    size,
                    gender,
                    is_adopted,
                    characteristics}) : navigate("/feed");
                is_owner ? setSelectedCharacteristics(characteristics) : navigate("/feed");
            } catch (err) {
                console.log(err);
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
            await axiosReq.put(`/dogs/${id}/`, formData);
            navigate(`/dogs/${id}`)
        } catch (err) {
            if (err.response?.status !== 401) {
                setErrors(err.response?.data)
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
                                <Form.Group className="mb-4">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" name="name" value={name} onChange={handleChange} />
                                </Form.Group>
                                {errors?.name?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group className="mb-4">
                                    <Form.Label>Description</Form.Label>
                                    <div id="editor"></div>
                                </Form.Group>
                                {errors?.description?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group className="mb-4">
                                    <Form.Label>Breed</Form.Label>
                                    <Form.Control type="text" name="breed" value={breed} onChange={handleChange} />
                                </Form.Group>
                                {errors?.breed?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group className="mb-4">
                                    <Form.Label>Birthday</Form.Label>
                                    <Form.Control type="date" name="birthday" value={birthday} onChange={handleChange} max={today} />
                                </Form.Group>
                                {errors?.birthday?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group className="mb-4">
                                    <Form.Label>Size</Form.Label>
                                    <Form.Select value={size} name="size" onChange={handleChange}>
                                        <option key="small" value="small">Small</option>
                                        <option key="medium" value="medium">Medium</option>
                                        <option key="big" value="big">Big</option>
                                    </Form.Select>
                                </Form.Group>
                                {errors?.gender?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group className="mb-4">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Select value={gender} name="gender" onChange={handleChange}>
                                        <option key="male" value="male">Male</option>
                                        <option key="female" value="female">Female</option>
                                    </Form.Select>
                                </Form.Group>
                                {errors?.gender?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group className="mb-4">
                                    <Form.Label>Add characteristics of the dog</Form.Label>
                                    <Form.Select multiple value={selectedCharacteristics} onChange={handleSelectChange}>
                                        <option value="">No characteristics</option>
                                        {characteristics.map((characteristic) => (
                                            <option key={characteristic.id} value={characteristic.id}>{characteristic.characteristic}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label>Adopted?</Form.Label>
                                    <Form.Check type="checkbox" name="is_adopted" value={is_adopted} onChange={handleChange} />
                                </Form.Group>
                                {errors?.is_adopted?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}

                                <div className="mt-4">
                                    <Button className={`${btnStyles.ReverseButton} ${btnStyles.Button}`}
                                            onClick={handleGoBack}>
                                        Go back
                                    </Button>
                                    <Button className={`${btnStyles.Button}`} type="submit">
                                        Save Dog
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

export default DogEditForm;