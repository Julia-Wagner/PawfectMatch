import React, {useEffect, useState} from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import {useParams} from "react-router-dom";
import {axiosReq} from "../../api/axiosDefaults";
import Post from "./Post";
import styles from "../../styles/PostsPage.module.css";

function PostPage() {
    const {id} = useParams();
    const [post, setPost] = useState({results: []});

    useEffect(() => {
        const handleMount = async () => {
            try {
                const [{data: post}] = await Promise.all([
                    axiosReq.get(`/posts/${id}`),
                ])
                setPost({results: [post]})
            } catch (err) {
                console.log(err)
            }
        };

        handleMount();
    }, [id]);

    return (
        <Container>
            <Row className="h-100 mt-4">
                <Col className="py-2 p-0 p-lg-2" lg={8}>
                    <Post {...post.results[0]} setPosts={setPost} postPage />
                </Col>
                <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
                    <Container className={`text-center ${appStyles.Content}`}>
                        <h3 className={styles.SidebarHeading}>Saved Posts</h3>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

export default PostPage;