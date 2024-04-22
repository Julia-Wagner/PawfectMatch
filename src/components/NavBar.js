import React from 'react'
import {Container, Nav, Navbar, NavLink} from "react-bootstrap";
import logo from "../assets/logo.png"

const NavBar = () => {
    return (
        <Navbar expand="md" fixed="top">
            <Container>
                <NavLink to="/">
                    <Navbar.Brand>
                        <img src={logo} alt="logo" height="45" />
                    </Navbar.Brand>
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto text-left">
                        <Nav.Link><i className="fas fa-home"></i> Home</Nav.Link>
                        <Nav.Link><i className="fas fa-sign-in-alt"></i> Sign in</Nav.Link>
                        <Nav.Link><i className="fas fa-user-plus"></i> Sign up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar;