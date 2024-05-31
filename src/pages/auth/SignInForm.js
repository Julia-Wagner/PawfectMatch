import React, {useState} from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

import { Link, useNavigate } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import playground from "../../assets/playground.svg";
import {useSetCurrentUser} from "../../contexts/CurrentUserContext";
import {useRedirect} from "../../hooks/useRedirect";
import {setTokenTimestamp} from "../../utils/utils";

function SignInForm() {
    const setCurrentUser = useSetCurrentUser();
    useRedirect('loggedIn')

    const [signInData, setSignInData] = useState({
        username: "",
        password: "",
    });
    const { username, password } = signInData;

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const {data} = await axios.post("/dj-rest-auth/login/", signInData);
            setCurrentUser(data.user)
            setTokenTimestamp(data)
            navigate('/feed');
        } catch (err) {
            setErrors(err.response?.data);
        }
    };

    const handleChange = (event) => {
        setSignInData({
            ...signInData,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <Container className={styles.Container}>
            <Row className={`my-auto`}>
                <Col className="my-auto py-2 p-md-2 mx-auto" md={8}>
                    <Container className={`${appStyles.Content} p-4 `}>
                        <h2 className={styles.Header}>Sign in</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label className="sr-only">Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    className={styles.Input}
                                    value={username}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {errors.username?.map((message, idx) => (
                                <Alert key={idx} variant="warning">
                                    {message}
                                </Alert>
                            ))}

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label className="sr-only">Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    className={styles.Input}
                                    value={password}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {errors.password?.map((message, idx) => (
                                <Alert key={idx} variant="warning">
                                    {message}
                                </Alert>
                            ))}
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
                                type="submit">
                                Sign in
                            </Button>
                            {errors.non_field_errors?.map((message, idx) => (
                                <Alert key={idx} variant="warning" className="mt-3">
                                    {message}
                                </Alert>
                            ))}
                        </Form>
                    </Container>
                    <Container className={`mt-3 ${appStyles.Content}`}>
                        <Link className={styles.Link} to="/signup">
                            Don&apos;t have an account? <span>Sign up now!</span>
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
}

export default SignInForm;