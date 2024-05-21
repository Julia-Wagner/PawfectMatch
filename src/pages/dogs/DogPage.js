import React, {useEffect, useState} from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import {useParams} from "react-router-dom";
import {axiosReq} from "../../api/axiosDefaults";
import Sidebar from "../../components/Sidebar";
import {useFollowers} from "../../contexts/FollowersContext";
import Dog from "./Dog";

function DogPage() {
    const {id} = useParams();
    const [dog, setDog] = useState({results: []});
    const {shouldUpdate} = useFollowers();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const [{data: dog}] = await Promise.all([
                    axiosReq.get(`/dogs/${id}/`),
                ])
                setDog({results: [dog]})
            } catch (err) {
                console.log(err)
            }
        };

        handleMount();
    }, [id, shouldUpdate]);

    return (
        <Container>
            <Row className="h-100 mt-4">
                <Col className="py-2 p-0 p-lg-2" lg={8}>
                    <Dog {...dog.results[0]} setDogs={setDog} dogPage />
                </Col>
                <Sidebar/>
            </Row>
        </Container>
    );
}

export default DogPage;