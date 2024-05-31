import React, {useEffect, useState} from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import {useParams} from "react-router-dom";
import {axiosReq} from "../../api/axiosDefaults";
import Post from "./Post";
import Sidebar from "../../components/Sidebar";
import {useFollowers} from "../../contexts/FollowersContext";

function PostPage() {
    const {id} = useParams();
    const [post, setPost] = useState({results: []});
    const {shouldUpdate} = useFollowers();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const [{data: post}] = await Promise.all([
                    axiosReq.get(`/posts/${id}/`),
                ])
                setPost({results: [post]})
            } catch (err) {
                // console.log(err)
            }
        };

        handleMount();
    }, [id, shouldUpdate]);

    return (
        <Container>
            <Row className="h-100 mt-4">
                <Col className="py-2 p-0 p-lg-2" lg={8}>
                    <Post {...post.results[0]} setPosts={setPost} postPage />
                </Col>
                <Sidebar/>
            </Row>
        </Container>
    );
}

export default PostPage;