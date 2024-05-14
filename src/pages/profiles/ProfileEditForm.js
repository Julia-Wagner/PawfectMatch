import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { axiosReq } from "../../api/axiosDefaults";
import {
    useCurrentUser,
    useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import {getAllCountries} from "react-country-list";

const countries = getAllCountries();

const ProfileEditForm = () => {
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();
    const { id } = useParams();
    const navigate = useNavigate();
    const imageFile = useRef();

    const [profileData, setProfileData] = useState({
        name: "",
        description: "",
        address_1: "",
        address_2: "",
        city: "",
        postcode: "",
        country: "",
    });
    const {
        name,
        description,
        address_1,
        address_2,
        city,
        postcode,
        country,
        image
    } = profileData;

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const handleMount = async () => {
            if (currentUser?.profile_id?.toString() === id) {
                try {
                    const { data } = await axiosReq.get(`/profiles/${id}/`);
                    const {
                        name,
                        description,
                        address_1,
                        address_2,
                        city,
                        postcode,
                        country,
                        image
                    } = data;
                    setProfileData({
                        name,
                        description,
                        address_1,
                        address_2,
                        city,
                        postcode,
                        country,
                        image
                    });
                } catch (err) {
                    console.log(err);
                    navigate("/");
                }
            } else {
                navigate("/");
            }
        };

        handleMount();
    }, [currentUser, navigate, id]);

    const handleChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("address_1", address_1);
        formData.append("address_2", address_2);
        formData.append("city", city);
        formData.append("postcode", postcode);

        if (country !== undefined) {
            formData.append("country", country);
        }

        if (imageFile?.current?.files && imageFile.current.files[0]) {
            formData.append("image", imageFile?.current?.files[0]);
        }

        try {
            const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
            setCurrentUser((currentUser) => ({
                ...currentUser,
                profile_image: data.image,
            }));
            navigate(-1);
        } catch (err) {
            console.log(err);
            setErrors(err.response?.data);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    }

    return (
        <Container>
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
                                    <Form.Control as="textarea" name="description" value={description} onChange={handleChange} rows={7} />
                                </Form.Group>
                                {errors?.description?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group className="mb-4">
                                    <Form.Label>Address 1</Form.Label>
                                    <Form.Control type="text" name="address_1" value={address_1} onChange={handleChange} />
                                </Form.Group>
                                {errors?.address_1?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group className="mb-4">
                                    <Form.Label>Address 2</Form.Label>
                                    <Form.Control type="text" name="address_2" value={address_2} onChange={handleChange} />
                                </Form.Group>
                                {errors?.address_2?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group className="mb-4">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="text" name="city" value={city} onChange={handleChange} />
                                </Form.Group>
                                {errors?.city?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group className="mb-4">
                                    <Form.Label>Postcode</Form.Label>
                                    <Form.Control type="text" name="postcode" value={postcode} onChange={handleChange} />
                                </Form.Group>
                                {errors?.postcode?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}
                                <Form.Group className="mb-4">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Select name="country" value={country} onChange={handleChange}>
                                        <option key="" value="">Select a country</option>

                                        {countries.map((countryOption) => (
                                            <option key={countryOption.name} value={countryOption.name}>
                                                {countryOption.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                {errors?.country?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>{message}</Alert>
                                ))}

                                <div className="mt-4">
                                    <Button className={`${btnStyles.ReverseButton} ${btnStyles.Button}`}
                                            onClick={handleGoBack}>
                                        Go back
                                    </Button>
                                    <Button className={`${btnStyles.Button}`} type="submit">
                                        Save Changes
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
                                {image && (
                                    <figure>
                                        <Image src={image} fluid />
                                    </figure>
                                )}
                                {errors?.image?.map((message, idx) => (
                                    <Alert variant="warning" key={idx}>
                                        {message}
                                    </Alert>
                                ))}
                                <div>
                                    <Form.Label
                                        className={`${btnStyles.Button} btn mt-auto mb-3`}
                                        htmlFor="image-upload"
                                    >
                                        Change the image
                                    </Form.Label>
                                </div>
                                <Form.Control id="image-upload" type="file"
                                              onChange={(e) => {
                                                  if (e.target.files.length) {
                                                      setProfileData({
                                                          ...profileData,
                                                          image: URL.createObjectURL(e.target.files[0]),
                                                      });
                                                  }
                                              }} ref={imageFile} />
                            </Form.Group>
                        </Container>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default ProfileEditForm;