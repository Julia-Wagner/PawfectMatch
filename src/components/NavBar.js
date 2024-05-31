import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/logo.webp";
import styles from "../styles/NavBar.module.css"
import {NavLink} from "react-router-dom";
import {useCurrentUser, useIsShelterUser, useSetCurrentUser} from "../contexts/CurrentUserContext";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import {removeTokenTimestamp} from "../utils/utils";
import React from "react";

const NavBar = () => {
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();
    const isShelterUser = useIsShelterUser();

    const {expanded, setExpanded, ref} = useClickOutsideToggle();

    const handleSignOut = async () => {
        try {
            await axios.post("dj-rest-auth/logout/");
            setCurrentUser(null);
            removeTokenTimestamp();
        } catch (err) {
            console.log(err);
        }
    }

    const loggedInIcons = <>
        <div className="d-none d-lg-flex">
            <NavLink to="/feed" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Feed</NavLink>
            <NavLink to="/following" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Following</NavLink>
            {isShelterUser ? (
                <NavLink to="/dogs" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Dogs</NavLink>
            ) : (
                <NavLink to="/matches" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Matches</NavLink>
            )}
            <NavLink to={`/profiles/${currentUser?.profile_id}`} className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Profile</NavLink>
            <NavLink to="/" className={styles.NavLink} onClick={handleSignOut}>Sign out</NavLink>
        </div>
        <div className="d-flex d-lg-none flex-column">
            <NavLink to="/saves" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Saved Posts</NavLink>
            <NavLink to="/adopted" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Adopted Dogs</NavLink>
            <NavLink to="/" className={styles.NavLink} onClick={handleSignOut}>Sign out</NavLink>
        </div>

    </>

    const loggedOutIcons = (
        <>
            <NavLink to="/feed" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Feed</NavLink>
            <NavLink to="/signin" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Sign in</NavLink>
            <NavLink to="/signup" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Sign up</NavLink>
        </>
    )

    return (
        <header>
            <Navbar expanded={expanded} className={styles.NavBar} expand="lg" sticky="top">
                <Container>
                    <NavLink to="/">
                        <h1>
                            <span className="sr-only">PawfectMatch</span>
                            <img className={styles.Logo} src={logo} alt="PawfectMatch Logo" height="45" />
                        </h1>
                    </NavLink>
                    <Navbar.Toggle
                        ref={ref}
                        onClick={() => setExpanded(!expanded)}
                        aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto text-center">
                            {currentUser ? loggedInIcons : loggedOutIcons}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default NavBar;