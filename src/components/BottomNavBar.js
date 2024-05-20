import React from 'react'
import {Container, Nav, Navbar} from "react-bootstrap";
import styles from "../styles/NavBar.module.css"
import { NavLink } from "react-router-dom";
import {useCurrentUser, useIsShelterUser} from "../contexts/CurrentUserContext";

const BottomNavBar = () => {
    const currentUser = useCurrentUser();
    const isShelterUser = useIsShelterUser();

    const loggedInIcons = <>
        <NavLink to="/feed" id={styles.feed} className={({ isActive }) => isActive ? styles.BottomActive : styles.BottomNavLink}>Feed</NavLink>
        <NavLink to="/following" id={styles.following} className={({ isActive }) => isActive ? styles.BottomActive : styles.BottomNavLink}>Following</NavLink>
        {isShelterUser ? (
            <NavLink to="/dogs" id={styles.matches} className={({ isActive }) => isActive ? styles.BottomActive : styles.BottomNavLink}>Dogs</NavLink>
        ) : (
            <NavLink to="/matches" id={styles.matches} className={({ isActive }) => isActive ? styles.BottomActive : styles.BottomNavLink}>Matches</NavLink>
        )}
        <NavLink to={`/profiles/${currentUser?.profile_id}`} id={styles.profile} className={({ isActive }) => isActive ? styles.BottomActive : styles.BottomNavLink}>Profile</NavLink>
    </>

    const loggedOutIcons = (
        <>
            <NavLink to="/feed" id={styles.feed} className={({ isActive }) => isActive ? styles.BottomActive : styles.BottomNavLink}>Feed</NavLink>
            <NavLink to="/signin" id={styles.sign} className={({ isActive }) => isActive ? styles.BottomActive : styles.BottomNavLink}>Sign in</NavLink>
            <NavLink to="/signup" id={styles.sign} className={({ isActive }) => isActive ? styles.BottomActive : styles.BottomNavLink}>Sign up</NavLink>
        </>
    )

    return (
        <Navbar className={`d-md-none ${styles.BottomNavBar}`} sticky="bottom">
            <Container className="p-0">
                <Navbar.Collapse id="bottom-navbar-nav">
                    <Nav className={`text-center w-100 ${styles.BottomGrid}`}>
                        {currentUser ? loggedInIcons : loggedOutIcons}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default BottomNavBar;