import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import playground from "../../assets/playground.svg"

import {Form, Button, Image, Col, Row, Container, Alert} from "react-bootstrap";
import axios from "axios";
import {useRedirect} from "../../hooks/useRedirect";

const SignUpForm = () => {
    useRedirect('loggedIn')
    const [signUpData, setSignUpData] = useState({
        username: "",
        password1: "",
        password2: "",
    });
    const { username, password1, password2 } = signUpData;

    const [errors, setErrors] = useState({});
    const [checked, setChecked] = useState(false);

    const navigate= useNavigate();

    const handleChange = (event) => {
        setSignUpData({
            ...signUpData,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("/dj-rest-auth/registration/", signUpData);
            if (checked) {
                // update profile if user registers as shelter
                let profileId = response.data.user.profile_id;
                let token = response.data.access_token;
                await axios.put(`/profiles/${profileId}/`, {
                    type: "shelter"
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            navigate("/signin");
        } catch (err) {
            setErrors(err.response?.data);
        }
    }

    return (
        <Container className={styles.Container}>
            <Row className={`my-auto`}>
                <Col className="my-auto py-2 p-md-2 mx-auto" md={8}>
                    <Container className={`${appStyles.Content} p-4 `}>
                        <h2 className={styles.Header}>Create your account</h2>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label className="d-none">Username</Form.Label>
                                <Form.Control
                                    className={styles.Input}
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    value={username}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {errors.username?.map((message, idx) =>
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            )}

                            <Form.Group className="mb-3" controlId="password1">
                                <Form.Label className="d-none">Password</Form.Label>
                                <Form.Control
                                    className={styles.Input}
                                    type="password"
                                    placeholder="Password"
                                    name="password1"
                                    value={password1}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {errors.password1?.map((message, idx) =>
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            )}

                            <Form.Group className="mb-3" controlId="password2">
                                <Form.Label className="d-none">Confirm password</Form.Label>
                                <Form.Control
                                    className={styles.Input}
                                    type="password"
                                    placeholder="Confirm password"
                                    name="password2"
                                    value={password2}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {errors.password2?.map((message, idx) =>
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            )}
                            {errors.non_field_errors?.map((message, idx) =>
                                <Alert variant="warning" className="mt-3" key={idx}>{message}</Alert>
                            )}

                            <Form.Group controlId="shelterCheckbox" className="mb-4 d-flex justify-content-center gap-2">
                                <Form.Check type="checkbox" name="shelter"
                                            onChange={(e) => setChecked(e.currentTarget.checked)} />
                                <Form.Label>Register as shelter</Form.Label>
                            </Form.Group>

                            <Button className={`${btnStyles.Button} ${btnStyles.Wide}`} type="submit">
                                Sign up
                            </Button>
                        </Form>

                    </Container>
                    <Container className={`mt-3 ${appStyles.Content}`}>
                        <Link className={styles.Link} to="/signin">
                            Already have an account? <span>Sign in</span>
                        </Link>
                    </Container>
                </Col>
            </Row>
            <Row>
                <Col className={`my-auto p-2`}>
                    <Image className={`${appStyles.FillerImage}`} src={playground} alt="Dogs on a playground" />
                </Col>
            </Row>
        </Container>
    );
};

export default SignUpForm;