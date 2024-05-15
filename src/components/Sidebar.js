import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import appStyles from "../App.module.css";
import React from "react";

const Sidebar = () => {

    return (
        <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
            <Container className={`text-center ${appStyles.Content}`}>
                <h3 className={appStyles.SidebarHeading}>Saved Posts</h3>
            </Container>
        </Col>
    );
}

export default Sidebar;