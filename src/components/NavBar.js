import React from 'react'
import {Container, Nav, Navbar} from "react-bootstrap";
import logo from "../assets/logo.webp";
import styles from "../styles/NavBar.module.css"
import { NavLink } from "react-router-dom";

const NavBar = () => {
    return (
        <Navbar className={styles.NavBar} expand="md" fixed="top">
            <Container>
                <NavLink to="/">
                    <Navbar.Brand>
                        <img src={logo} alt="logo" height="45" />
                    </Navbar.Brand>
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto text-left">
                        <NavLink to="/feed" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Feed</NavLink>
                        <NavLink to="/signin" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Sign in</NavLink>
                        <NavLink to="/signup" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Sign up</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar;