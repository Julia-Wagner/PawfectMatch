import React from 'react'
import {Container, Nav, Navbar} from "react-bootstrap";
import styles from "../styles/NavBar.module.css"
import { NavLink } from "react-router-dom";

const BottomNavBar = () => {
    return (
        <Navbar className={`d-md-none ${styles.BottomNavBar}`} sticky="bottom">
            <Container className="p-0">
                <Navbar.Collapse id="bottom-navbar-nav">
                    <Nav className={`text-center w-100 ${styles.BottomGrid}`}>
                        <NavLink to="/feed" id={styles.feed} className={({ isActive }) => isActive ? styles.BottomActive : styles.BottomNavLink}>Feed</NavLink>
                        <NavLink to="/signin" id={styles.feed} className={({ isActive }) => isActive ? styles.BottomActive : styles.BottomNavLink}>Sign in</NavLink>
                        <NavLink to="/signup" id={styles.sign} className={({ isActive }) => isActive ? styles.BottomActive : styles.BottomNavLink}>Sign up</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default BottomNavBar;